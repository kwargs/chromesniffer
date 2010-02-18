/**
 * Chrome AppSniffer
 *
 * Detect apps run on current page and send back to background page.
 * Some part of this script was refered from Wappalyzer Firefox Addon.
 *
 * @author Bao Nguyen <contact@nqbao.com>
 * @license GPLv3
 **/
 
var __chrome_sniffer__ = function(){ // run the whole apps inside scopes
	var _apps = {};
	var doc = document.documentElement;

	// 1: detect by script tags
	var scripts = doc.getElementsByTagName("script");

	var script_tests = {
		'jQuery': /jquery/i,
		'jQuery UI': /jquery[-.]ui/i,
		'Drupal': /drupal/i,
		'Google Analytics': /google-analytics.com\/(ga|urchin).js/i,
		'Yandex Metrics': /mc\.yandex\.ru\/metrika\/watch\.js/,
		'Quantcast': /quantserve\.com\/quant\.js/i,
		'Prototype': /prototype\.js/i,
		'Joomla': /\/components\/com_/,
		'Ubercart': /uc_cart/i,
		'ExtJS': /ext\-base\.js/i,
		'Closure': /\/goog\/base\.js/i,
		'IPB': /ipb.*js/,
		'MODx': /\/min\/.*f=.*/,
		'MooTools': /mootools/i,
		'Dojo': /dojo(\.xd)?\.js/i,
		'script.aculo.us': /scriptaculous\.js/i,
		'YUI': /\/yui\/|yui\.yahooapis\.com/i,
		'Disqus': /disqus.com\/forums/i,
		'GetSatisfaction': /getsatisfaction\.com\/feedback/i,
		'Wibiya': /wibiya\.com\/Loaders\//i,
		'reCaptcha': /api\.recaptcha\.net\//i,
		'Mollom': /mollom\/mollom\.js/i, // only work on Drupal now
		'ZenPhoto': /zp-core\/js/i,
		'Gallery2': /main\.php\?.*g2_.*/i,
		'AdSense': /pagead\/show_ads\.js/
	};

	for (var idx in scripts)
	{
		var s = scripts[idx];
		if (!s.src) continue;
		s = s.src;

		for (var t in script_tests)
		{
			if (t in _apps) continue;
			if (script_tests[t].test(s))
			{
				_apps[t] = 1;
			}
		}
	}

	// 2: detect by meta tags
	var metas = doc.getElementsByTagName("meta");
	var meta_tests = {
		'generator': {
			'Joomla': /joomla/i,
			'vBulletin': /vBulletin/i,
			'WordPress': /wordPress/i,
			'XOOPS': /xoops/i,
			'Plone': /plone/i,
			'MediaWiki': /MediaWiki/i,
			'CMSMadeSimple': /CMS Made Simple/i,
			'SilverStripe': /SilverStripe/i,
			'Movable Type': /Movable Type/i,
			'Amiro.CMS': /Amiro/i,
			'Koobi': /koobi/i,
			'bbPress': /bbPress/i,
			'DokuWiki': /dokuWiki/i,
			'TYPO3': /TYPO3/i,
			'PHP-Nuke': /PHP-Nuke/i,
			'DotNetNuke': /DotNetNuke/i,
			'Sitefinity': /Sitefinity/i,
			'WebGUI': /WebGUI/i,
			'ez Publish': /eZ\s*Publish/i,
			'BIGACE': /BIGACE/i,
			'TypePad': /typepad\.com/i,
			'Blogger': /blogger/i
		},
		'copyright': {
			'phpBB': /phpBB/i
		}
	};

	for (var idx in metas)
	{
		var m = metas[idx];
		var name = m.name ? m.name.toLowerCase() : "";

		if (!meta_tests[name]) continue;
		
		for (var t in meta_tests[name])
		{
			if (t in _apps) continue;
			if (meta_tests[name][t].test(m.content))
			{
				_apps[t] = 1;
			}
		}
	}

	// 3: detect by domains

	// 4: detect by regexp
	var text = document.documentElement.innerHTML;
	var text_tests = {
		'SMF': /<script .+\s+var smf_/i,
		'Magento': /var BLANK_URL = '[^>]+js\/blank\.html'/i,
		'Tumblr': /<iframe src=("|')http:\/\/www\.tumblr\.com/i,
		'WordPress': /<link rel=("|')stylesheet("|') [^>]+wp-content/i,
		'Closure': /<script[^>]*>.*goog\.require/is,
		'Liferay': /<script[^>]*>.*LifeRay\.currentURL/is,
		'vBulletin': /vbmenu_control/i,
		'MODx': /(<a[^>]+>Powered by MODx<\/a>|var el= \$\('modxhost'\);|<script type=("|')text\/javascript("|')>var MODX_MEDIA_PATH = "media";)/i,
		'miniBB': /<a href=("|')[^>]+minibb.+\s*<!--End of copyright link/is,
		'PHP-Fusion': /(href|src)=["']?infusions\//i, // @todo: recheck this pattern again
		'OpenX': /(href|src)=["'].*delivery\/(afr|ajs|avw|ck)\.php[^"']*/,
		'GetSatisfaction': /asset_host\s*\+\s*"javascripts\/feedback.*\.js/igm, // better recognization
	};

	for (t in text_tests)
	{
		if (t in _apps) continue;
		if (text_tests[t].test(text))
		{
			_apps[t] = 1;
		}
	}

	// 5: detect by header
	// @todo

	// 6: detect based on built-in database
	// @todo

	// convert to array
	var _apps_array = [];
	for (var a in _apps) _apps_array.push(a);
	//_apps_array.sort();

	// send back to background page
	chrome.extension.sendRequest({msg: "sniff",info: _apps_array}, function(response) {
	  // nothing
	});
};

__chrome_sniffer__();
