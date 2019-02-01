<?php
include 'lib/snippet.php';
include 'lib/config.php';
include 'lib/cookie.php';
include 'lib/get.php';
include 'lib/post.php';
include 'lib/login.php';

$config = include 'config.php';
global $config;

$error = false;
global $error;

login::loginUser();

snippet('login');