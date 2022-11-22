const path = require('path');

const express = require('express');
const session = require('express-session');
const csrf = require('csurf');

const sessionConfig = require('./config/session');
const db = require('./data/database');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const authMiddleware = require('./middlewares/auth-middleware');
const addCSRFTokenMiddleware = require('./middlewares/csrf-token-middleware');
const guardRoute = require('./middlewares/auth-protection-middleware');

const mongoDbSessionStore = sessionConfig.createSessionStore(session);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.use(session(sessionConfig.createSessionConfig(mongoDbSessionStore)));
app.use(csrf());

app.use(addCSRFTokenMiddleware);
app.use(authMiddleware);

// app.use(guardRoute);
// Using the guard Middleware is wrong.
// Because now the unauthenticated users won't ever be able to reach the 
// login and signup routes down below.
// Therefor, we don't use the guard middleware in here.
// Even if we add this middleware after the below routes, it still will be wrong.
// As that would be too late cause the route controller routes has already handled that request.
// So we need to add this middleware where we define our routes.

// app.use(blogRoutes);
// app.use(authRoutes);

app.use(authRoutes);
app.use(blogRoutes);
// We need to move authRoutes in-front of blogRoutes because
// 401 guardRoute is defined on authRoutes. As we've added guardRoutes inside the 
// BlogRoutes as well, in order for guardRoutes to be executed inside blogRoutes,
// We need to Move authRoutes in-front of blog routes because guarRoutes is
// defined inside authRoutes.

app.use(function (error, req, res, next) {
  res.render('500');
});

db.connectToDatabase().then(function () {
  app.listen(3000);
});
