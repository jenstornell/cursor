<?= snippet('header'); ?>

<main id="login">
  <div class="logo">
    <figure class="text">
      Markdown Surface
    </figure>
  </div>
  <form method="post">
    <label for="username">Username</label>
    <input type="text" name="username" value="<?= isset($_POST['username']) ? $_POST['username'] : ''; ?>">

    <label for="password">Password</label>
    <input type="password" name="password" value="<?= isset($_POST['password']) ? $_POST['password'] : ''; ?>">

    <input type="submit">
  </form>
</main>

</body>
</html>