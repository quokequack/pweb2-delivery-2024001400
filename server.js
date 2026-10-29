import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import expressLayouts from 'express-ejs-layouts';
import session from 'express-session';
import flash from 'connect-flash';
import methodOverride from 'method-override';
import { WebRouter } from './dist/src/routes/WebRouter.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
app.set('layout', 'layouts/base');
app.use(expressLayouts);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride('_method'));

app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.sucesso = req.flash('success');
    res.locals.erro = req.flash('error');
    next();
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
    res.redirect('/entregas');
});

const router = new WebRouter();
app.use('/', router.getRouter());

app.use((req, res) => {
    res.status(404).render('errors/404', {
        titulo: 'Página não encontrada',
        mensagem: 'A página solicitada não existe.'
    });
});

app.use((err, req, res, next) => {
    console.error(err);

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).render('errors/generico', {
        titulo: 'Erro interno',
        mensagem: 'Ocorreu um erro inesperado.'
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor em http://localhost:${PORT}`);
});
