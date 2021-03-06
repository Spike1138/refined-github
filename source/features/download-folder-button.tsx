import React from 'dom-chef';
import select from 'select-dom';
import features from '../libs/features';

function init(): void {
	const buttonGroup = select('.file-navigation .BtnGroup.float-right');
	if (buttonGroup) {
		buttonGroup.prepend(
			<a
				className="btn btn-sm BtnGroup-item"
				href={`https://download-directory.github.io/?url=${location.href}`}>
				Download
			</a>
		);
	}
}

features.add({
	id: 'download-folder-button',
	description: 'Download entire folders from repositories using the `Download folder` button. (Uses https://download-directory.github.io)',
	include: [
		features.isRepoTree
	],
	exclude: [
		features.isRepoRoot // Already has an native download ZIP button
	],
	load: features.onAjaxedPages,
	init
});
