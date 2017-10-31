<?php
# подключаем конфиг
include 'conf.php';
	
# проверка авторизации
if (isset($_COOKIE['id']) and isset($_COOKIE['hash'])) 
{    
	
	$userdata = mysql_fetch_assoc(mysql_query("SELECT * FROM users WHERE users_id = '".intval($_COOKIE['id'])."' LIMIT 1"));

    if(($userdata['users_hash'] !== $_COOKIE['hash']) or ($userdata['users_id'] !== $_COOKIE['id'])) 
    { 
        setcookie('id', '', time() - 60*24*30*12, '/'); 
        setcookie('hash', '', time() - 60*24*30*12, '/');
    setcookie('errors', '1', time() + 60*24*30*12, '/');
    header('Location: login.php'); exit();
    } 
} 
else 
{ 
  setcookie('errors', '2', time() + 60*24*30*12, '/');
  header('Location: login.php'); exit();
}
?>
<body>
	<div class = "contanier">
		<div class="row">
			<div class="col-md-6 col-md-offset-2"></div>
			<div class="col-md-4"></div>
		</div>
<form action="" method="post"><input type='submit' name='exit' value='Выйти'/></form>
<?php
if($_REQUEST['exit']) 
  {
        setcookie('id', '', time() - 60*60*24*30, '/'); 
        setcookie('hash', '', time() - 60*60*24*30, '/');
        header('Location: login.php'); exit();
  }
?>
</body>
</html>