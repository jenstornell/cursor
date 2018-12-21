<?php
include 'lib/login.php';
include 'lib/config.php';
include 'lib/cookie.php';
include 'lib/snippet.php';

$config = include 'config.php';
global $config;

cookie::delete();

snippet('logout');