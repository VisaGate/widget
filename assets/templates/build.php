<?php

if (php_sapi_name() !== 'cli') {
	throw new Exception('Not permitted');
}

$langs = ['de', 'en'];

foreach ($langs as $lang) {
	
	#Include translations
	include "{$lang}/translation.php";
	
	#Load the files
	$files = glob("_/*.html");
	
	foreach ($files as $file) {
		ob_start();
		include $file;
		$contents = ob_get_clean();
		file_put_contents(str_replace('_/', "{$lang}/", $file), $contents);
	}
}