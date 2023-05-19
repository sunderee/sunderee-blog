let mix = require('laravel-mix');

mix.js('resources/assets/app.js', 'app.js')
    .postCss('resources/assets/app.css', 'app.css', [
        require('tailwindcss'),
        require('autoprefixer'),
    ]).setPublicPath('_media')
    .copyDirectory('_media', '_site/media');
