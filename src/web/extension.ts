import * as vscode from 'vscode';

const DEFAULT_STATUS_TEXT = 'TTW Ready';
const DEFAULT_STATUS_TOOLTIP = 'Trailing whitespace trimmer formatter is ready to use.';

class DocumentFormatter implements vscode.DocumentFormattingEditProvider {
	/**
	 * The timeout for resetting the status bar to its default value
	 */
	private statusbarResetTimeout: number | null;

	/**
	 * The status bar item
	 */
	private statusBarItem: vscode.StatusBarItem;

	/**
	 * Instantiates a new document formatter provider
	 * 
	 * @param statusBarItem  The status bar item
	 */
	public constructor(statusBarItem: vscode.StatusBarItem) {
		this.statusbarResetTimeout = null;
		this.statusBarItem = statusBarItem;
	}

	/**
	 * Provides formatting edits for a whole document
	 *
	 * @param document  The document in which the command was invoked
	 * @param options   Options controlling formatting
	 * @param token     A cancellation token
	 * @returns         A set of text edits or a thenable that resolves to such. The lack of a result can be
	 *                  signaled by returning `undefined`, `null`, or an empty array
	 */
	public provideDocumentFormattingEdits(
		document: vscode.TextDocument,
		_: vscode.FormattingOptions,
		token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
		const edits: vscode.TextEdit[] = [];

		for (let i = 0; i < document.lineCount; i++) {
			if (token.isCancellationRequested) return [];

			const line = document.lineAt(i);
			const trimmed = line.text.replace(/\s+$/, '');

			if (trimmed === line.text) continue;
			edits.push(vscode.TextEdit.replace(line.range, trimmed));
		}


		if (token.isCancellationRequested) return []

		if (edits.length > 0)
			this.notify('$(check) TTW applied', 'Tailing whitespace trimmer applied', 1000);

		return edits;
	}

	/**
	 * Updates the status bar item to the specified contents and resets it after
	 * the specified number of milliseconds
	 * 
	 * @param text     The status bar text 
	 * @param tooltip  The tooltip text
	 * @param timeout  The reset timeout
	 */
	public notify(text: string, tooltip: string, timeout: number | null) {
		if (this.statusbarResetTimeout != null) clearTimeout(this.statusbarResetTimeout);

		this.statusBarItem.text = text;
		this.statusBarItem.tooltip = tooltip;

		if (timeout == null) return;

		setTimeout(() => {
			this.statusBarItem.text = DEFAULT_STATUS_TEXT;
			this.statusBarItem.tooltip = DEFAULT_STATUS_TOOLTIP;
		}, timeout);
	}
}

/**
 * Activates the extension. This function is called by VSCode.
 * 
 * @param context  The VSCode context 
 */
export function activate(context: vscode.ExtensionContext) {
	console.log('Trailing whitespace trimmer activating');

	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.text = DEFAULT_STATUS_TEXT;
	statusBarItem.tooltip = DEFAULT_STATUS_TOOLTIP;
	statusBarItem.show();

	const formatter = vscode.languages.registerDocumentFormattingEditProvider(
		{ language: '*' },
		new DocumentFormatter(statusBarItem)
	);

	context.subscriptions.push(formatter, statusBarItem);
}
