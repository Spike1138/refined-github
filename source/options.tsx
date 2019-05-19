import React from 'dom-chef';
import select from 'select-dom';
import linkifyUrls from 'linkify-urls';
import fitTextarea from 'fit-textarea';
import OptionsSync from 'webext-options-sync';
import {applyToLink as shortenLink} from 'shorten-repo-url';
import indentTextarea from 'indent-textarea';
import parseBackticks from './libs/parse-backticks';
import {editTextNodes} from './features/linkify-urls-in-code';

fitTextarea.watch('textarea');
indentTextarea.watch('textarea');

declare global {
	interface Window {
		collectFeatures: Map<string, string>;
	}
}

function parseDescription(description: string): DocumentFragment {
	const descriptionFragment = parseBackticks(description);
	editTextNodes(linkifyUrls, descriptionFragment);

	for (const a of select.all('a', descriptionFragment)) {
		if (/\.(jpe?g|gif|png)/g.test(a.pathname)) {
			a.textContent = 'image';
		} else {
			shortenLink(a, location.href);
		}
	}

	return descriptionFragment;
}

function buildFeatureCheckbox([name, description]: [string, string]): HTMLElement {
	return (
		<p>
			<input type="checkbox" name={`feature:${name}`} id={`feature:${name}`} />
			<span className="info">
				<label for={`feature:${name}`}>{name}</label>
				{' – '}
				<span className="description">{parseDescription(description)}</span>
				{' '}
				<a href={`https://github.com/sindresorhus/refined-github/blob/master/source/features/${name}.tsx`} target="_blank">
					source
				</a>
			</span>
		</p>
	);
}

const sortedFeaturePairs = [...window.collectFeatures.entries()]
	.sort(([a], [b]) => a.localeCompare(b));

document
	.querySelector('.js-features')!
	.append(...sortedFeaturePairs.map(buildFeatureCheckbox));

new OptionsSync().syncForm('#options-form');
