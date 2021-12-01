const path = require('path');
const fs = require('fs');

const targetSource = './build';
const targetDestination = '../server/static';

function rimraf(dirPath) {
	if (fs.existsSync(dirPath)) {
		fs.readdirSync(dirPath).forEach((entry) => {
			const entryPath = path.join(dirPath, entry);
			if (fs.lstatSync(entryPath).isDirectory()) {
				rimraf(entryPath);
			} else {
				fs.unlinkSync(entryPath);
			}
		});
		fs.rmdirSync(dirPath);
	}
}

function copyFileSync(source, target) {
	let targetFile = target;
	if (fs.existsSync(target)) {
		if (fs.lstatSync(target).isDirectory()) {
			targetFile = path.join(target, path.basename(source));
		}
	}
	fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source, target, root = false) {
	let files = [];
	const targetFolder = root ? target : path.join(target, path.basename(source));

	if (!fs.existsSync(targetFolder)) {
		fs.mkdirSync(targetFolder);
	}

	if (fs.lstatSync(source).isDirectory()) {
		files = fs.readdirSync(source);
		files.forEach((file) => {
			const curSource = path.join(source, file);
			if (fs.lstatSync(curSource).isDirectory()) {
				copyFolderRecursiveSync(curSource, targetFolder);
			} else {
				copyFileSync(curSource, targetFolder);
			}
		});
	}
}

const sourceFolder = path.resolve(targetSource);
const destinationFolder = path.resolve(targetDestination);

if (fs.existsSync(destinationFolder)) {
	rimraf(destinationFolder);
}

copyFolderRecursiveSync(sourceFolder, destinationFolder, true);
