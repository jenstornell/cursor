<?= snippet('header'); ?>
<div id="logout">
  <p>You have been logged out!</p>
  <a href="<?= config::get('url') . '/login.php'; ?>">Login again</a>
</div>
</body>
</html>