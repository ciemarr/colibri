const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);


// https://github.com/mochajs/mocha/issues/2640#issuecomment-348985952
let unhandledRejectionExitCode = 0;

process.on("unhandledRejection", (reason) => {
	unhandledRejectionExitCode = 1;
	throw reason;
});

process.prependListener("exit", (code) => {
	if (code === 0) {
		process.exit(unhandledRejectionExitCode);
	}
});