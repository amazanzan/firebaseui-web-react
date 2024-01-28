To use this package, clone the repo and install it with 

```bash
npm i
```

---

To add new Firebase UI languages, you'll need to clone https://github.com/firebase/firebaseui-web, then run:

```bash
npm run build build-js-{LANGUAGE_CODE}
```

Language codes [are defined here](https://github.com/firebase/firebaseui-web/blob/master/LANGUAGES.md).

Then manually place the resulting language file (e.g. esm\_\_ja.js) in firebaseui-web-react/firebaseui-i18n