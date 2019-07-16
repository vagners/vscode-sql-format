'use strict';

import * as vscode from 'vscode';

const editor = vscode.window.activeTextEditor;
const request = require("request");

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.sqlFormat', function () {

		if (editor) {
			let document = editor.document;
			var sql = document.getText();
			
			var options = {
				method: 'POST',
				url: 'https://promptformatapi.red-gate.com/api/format/Commas%20before',
				headers:
				{
					'cache-control': 'no-cache',
					Connection: 'keep-alive',
					'accept-encoding': 'gzip, deflate',
					Host: 'promptformatapi.red-gate.com',
					'Cache-Control': 'no-cache',
					Accept: '*/*',
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				form: { '': sql }
			};			
			
			request(options, function (error: string | undefined, response: any, body: any) {
				if (error) throw new Error(error);

				editor.edit(editBuilder => {

					var firstLine = editor.document.lineAt(0);
					var lastLine = editor.document.lineAt(editor.document.lineCount - 1);
					var textRange = new vscode.Range(0,
						firstLine.range.start.character,
						editor.document.lineCount - 1,
						lastLine.range.end.character);

					editBuilder.delete(textRange);
					var formatBody = body.substr(1, body.length - 2)
						.replace(/\\r\\n/g, `\r\n`)
						.replace(/\\t/g, `\t`);
						
					editBuilder.insert(new vscode.Position(0, 0), formatBody);
				});
			});
		}
	});

	context.subscriptions.push(disposable);
}