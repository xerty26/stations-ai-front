import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { AppRoutes } from './App';

export const render = (url) =>
    renderToString(
        <StaticRouter location={url}>
            <AppRoutes />
        </StaticRouter>
    );
