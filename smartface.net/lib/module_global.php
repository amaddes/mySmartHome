<?php
function enter ()
 { 
$error = array(); //массив дл€ ошибок 	
if ($_POST['login'] != "" && $_POST['password'] != "") //если пол€ заполнены 	

{ 		
	$login = $_POST['login']; 
	$password = $_POST['password'];
	
	$criteria = array('name' => $login);
	$doc = $collection->findOne($criteria);
	
	if ($password == $doc["pass"])
		{ 
		//пишем логин и хэшированный пароль в cookie, также создаЄм переменную сессии
		setcookie ("login", $login, time() + 50000); 						
		setcookie ("password", $doc["pass"], time() + 50000); 					
		$_SESSION['id'] = $doc["_id"];	//записываем в сессию id пользовател€ 				
		$id = $_SESSION['id']; 				
		lastAct($id); 				
		return $error; 			
		} 			
	else { 				
		$error[] = "Ќеверный пароль"; 										
		return $error; 			
		}
}	
 }


function login () { 	
		ini_set ("session.use_trans_sid", true); 	
		session_start();  	
		if (isset($_SESSION['id'])) //если сесcи€ есть 	
				{ 		
			if(isset($_COOKIE['login']) && isset($_COOKIE['password'])) //если cookie есть, то просто обновим врем€ их жизни и вернЄм true
					{ 		 			
						SetCookie("login", "", time() - 1, '/'); 			
						SetCookie("password","", time() - 1, '/'); 			
						setcookie ("login", $_COOKIE['login'], time() + 50000, '/'); 			
						setcookie ("password", $_COOKIE['password'], time() + 50000, '/'); 			
						$id = $_SESSION['id']; 			
						lastAct($id); 			
						return true; 		
					} 		
			else //иначе добавим cookie с логином и паролем, чтобы после перезапуска браузера сесси€ не слетала  		
					{ 			
						$rez = mysql_query("SELECT * FROM users WHERE id='{$_SESSION['id']}'"); //запрашиваем строку с искомым id 			
						if (mysql_num_rows($rez) == 1) //если получена одна строка
							{ 
								$row = mysql_fetch_assoc($rez); //записываем еЄ в ассоциативный массив 				
								setcookie ("login", $row['login'], time()+50000, '/'); 				
								setcookie ("password", md5($row['login'].$row['password']), time() + 50000, '/'); 
								$id = $_SESSION['id'];
								lastAct($id); 
								return true; 			
							} 
						else 
							return false; 		
			} 	
		} 	
		else //если сессии нет, то проверим существование cookie. ≈сли они существуют, то проверим их валидность по Ѕƒ 	
{ 		
if(isset($_COOKIE['login']) && isset($_COOKIE['password'])) //если куки существуют. 		

{ 			
$rez = mysql_query("SELECT * FROM users WHERE login='{$_COOKIE['login']}'"); //запрашиваем строку с искомым логином и паролем 			
@$row = mysql_fetch_assoc($rez); 			

if(@mysql_num_rows($rez) == 1 && md5($row['login'].$row['password']) == $_COOKIE['password']) //если логин и пароль нашлись в Ѕƒ 			

{ 				
$_SESSION['id'] = $row['id']; //записываем в сесиию id 				
$id = $_SESSION['id']; 				

lastAct($id); 				
return true; 			
} 			
else //если данные из cookie не подошли, то удал€ем эти куки, ибо нахуй они такие нам не нужны 			
{ 				
SetCookie("login", "", time() - 360000, '/'); 				

SetCookie("password", "", time() - 360000, '/');	 				
return false; 			

} 		
} 		
else //если куки не существуют 		
{ 			
return false; 		
} 	
} 
}






?>