# XylemJS

XylemJS is a Javascript library to develop frontend application.


## Key Features

- No build process is required.
	<br>
	Developer can write code that can be directly executed by modern browsers without going through build process.

- Has reactive primitive.
	<br>
	This means any change in value of a reactive primitive leads to change in DOM nodes that depend on that reactive primitive without expensive computation to figure out which DOM nodes are to be updated. This reduces CPU usages and thus leads to great User Experience.

- Declaration of HTML structure using built-in data-types of JavaScript.
	<br>
	This is based on [JRX (JSON Representation of XML)](https://github.com/sudo-barun/JRX).

- Supports SSR (Server Side Rendering) with Hydration.
	<br>
	Server side code written in any programming language can utilize SSR as long as there is JavaScript runtime (like NodeJS or Bun) present in the server.

- Supports old browsers through tooling.

- Has no runtime dependencies.
	<br>
	XylemJS uses Typescript as dev-dependency. Beside TypeScript there is no other dependency.  This means application using XylemJS won't suffer from security vulnurabilities of other npm packages.

- Has built-in support for Typescript.
	<br>
	Developer can use either JavaScript or TypeScript as per need.


## Browser support

- Any modern browser supporting module script can use XylemJS without any tooling.

- Older browser not supporting module script but supporting ES2015 can use XylemJS using bundler.

- Older browser not supporting ES2015 can use XylemJS using bundler and transpiler.

- It has been verified that it works on Internet Explorer 9 using Webpack and Babel without polyfill.
