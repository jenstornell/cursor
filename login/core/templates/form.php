<?php include __DIR__ . '/header.php'; ?>

<?php if(isset($_GET['error'])) : ?>
  <div class="message error show">
    <figure>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g>
          <path fill="none" d="M0 0h24v24H0z"/>
          <path fill="#fff" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"/>
        </g>
      </svg>
    </figure>
    <span>Oops! Something went wrong!</span>
  </div>
<?php endif; ?>

<?php if(!isset($_GET['error'])) : ?>
  <div class="message loggedin<?= ($knock->isLoggedIn()) ? ' show' : ''; ?>">
    <div class="text">
      <figure>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g>
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path fill="#ccc" d="M4 22a8 8 0 1 1 16 0h-2a6 6 0 1 0-12 0H4zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"></path>
            </g>
        </svg>
      </figure>
      
      <?php
        $username = '';
        if(isset($_COOKIE['knock'][walloption('key_cookie_username')])) {
          $username = $_COOKIE['knock'][walloption('key_cookie_username')];
        }
        echo htmlspecialchars($username, ENT_QUOTES, 'utf-8');
      ?>
    </div>
    <div class="right">
      <a href="<?= walloption('redirect.url'); ?>">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g>
                <path fill="none" d="M0 0h24v24H0z"/>
                <path fill="#fff" d="M18.364 15.536L16.95 14.12l1.414-1.414a5 5 0 1 0-7.071-7.071L9.879 7.05 8.464 5.636 9.88 4.222a7 7 0 0 1 9.9 9.9l-1.415 1.414zm-2.828 2.828l-1.415 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 1 0 7.071 7.071l1.414-1.414 1.415 1.414zm-.708-10.607l1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.07z"/>
            </g>
        </svg>
        <?= walloption('text.visit'); ?>
      </a>

      <a href="<?= wall::url('?logout'); ?>">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g>
            <path fill="none" d="M0 0h24v24H0z"/>
            <path fill="#fff" d="M4 18h2v2h12V4H6v2H4V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3zm2-7h7v2H6v3l-5-4 5-4v3z"/>
          </g>
        </svg>
        <?= walloption('text.logout'); ?>
      </a>
    </div>
  </div>
<?php endif; ?>

<form method="post" action="?login">

  <figure class="logo">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g>
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M7.39 16.539a8 8 0 1 1 9.221 0l2.083 4.76a.5.5 0 0 1-.459.701H5.765a.5.5 0 0 1-.459-.7l2.083-4.761zm6.735-.693l1.332-.941a6 6 0 1 0-6.913 0l1.331.941L8.058 20h7.884l-1.817-4.154zM8.119 10.97l1.94-.485a2 2 0 0 0 3.882 0l1.94.485a4.002 4.002 0 0 1-7.762 0z"/>
      </g>
    </svg>
  </figure>

    <label for="username"><?= walloption('text.username'); ?></label>
    <div class="input">
      <figure>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g>
          <path fill="none" d="M0 0h24v24H0z"/>
          <path fill="#333" d="M4 22a8 8 0 1 1 16 0h-2a6 6 0 1 0-12 0H4zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/>
            </g>
        </svg>
      </figure>
      <input type="text" value="<?= walloption('prefill.username'); ?>" spellcheck="false" id="username" name="username">
    </div>

    <label for="password"><?= walloption('text.password'); ?></label>
    <div class="input">
      <figure>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g>
            <path fill="none" d="M0 0h24v24H0z"/>
            <path fill="#333" d="M19 10h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1h1V9a7 7 0 1 1 14 0v1zM5 12v8h14v-8H5zm6 2h2v4h-2v-4zm6-4V9A5 5 0 0 0 7 9v1h10z"/>
            </g>
        </svg>
      </figure>
      <input type="password" value="<?= walloption('prefill.password'); ?>" id="password" name="password">
    </div>
    <input type="submit" value="<?= walloption('text.login'); ?>">
</form>

</body>
</html>