<?php
function enter ()
 { 
$error = array(); //������ ��� ������ 	
if ($_POST['login'] != "" && $_POST['password'] != "") //���� ���� ��������� 	

{ 		
	$login = $_POST['login']; 
	$password = $_POST['password'];
	
	$criteria = array('name' => $login);
	$doc = $collection->findOne($criteria);
	
	if ($password == $doc["pass"])
		{ 
		//����� ����� � ������������ ������ � cookie, ����� ������ ���������� ������
		setcookie ("login", $login, time() + 50000); 						
		setcookie ("password", $doc["pass"], time() + 50000); 					
		$_SESSION['id'] = $doc["_id"];	//���������� � ������ id ������������ 				
		$id = $_SESSION['id']; 				
		lastAct($id); 				
		return $error; 			
		} 			
	else { 				
		$error[] = "�������� ������"; 										
		return $error; 			
		}
}	
 }


function login () { 	
		ini_set ("session.use_trans_sid", true); 	
		session_start();  	
		if (isset($_SESSION['id'])) //���� ���c�� ���� 	
				{ 		
			if(isset($_COOKIE['login']) && isset($_COOKIE['password'])) //���� cookie ����, �� ������ ������� ����� �� ����� � ����� true
					{ 		 			
						SetCookie("login", "", time() - 1, '/'); 			
						SetCookie("password","", time() - 1, '/'); 			
						setcookie ("login", $_COOKIE['login'], time() + 50000, '/'); 			
						setcookie ("password", $_COOKIE['password'], time() + 50000, '/'); 			
						$id = $_SESSION['id']; 			
						lastAct($id); 			
						return true; 		
					} 		
			else //����� ������� cookie � ������� � �������, ����� ����� ����������� �������� ������ �� �������  		
					{ 			
						$rez = mysql_query("SELECT * FROM users WHERE id='{$_SESSION['id']}'"); //����������� ������ � ������� id 			
						if (mysql_num_rows($rez) == 1) //���� �������� ���� ������
							{ 
								$row = mysql_fetch_assoc($rez); //���������� � � ������������� ������ 				
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
		else //���� ������ ���, �� �������� ������������� cookie. ���� ��� ����������, �� �������� �� ���������� �� �� 	
{ 		
if(isset($_COOKIE['login']) && isset($_COOKIE['password'])) //���� ���� ����������. 		

{ 			
$rez = mysql_query("SELECT * FROM users WHERE login='{$_COOKIE['login']}'"); //����������� ������ � ������� ������� � ������� 			
@$row = mysql_fetch_assoc($rez); 			

if(@mysql_num_rows($rez) == 1 && md5($row['login'].$row['password']) == $_COOKIE['password']) //���� ����� � ������ ������� � �� 			

{ 				
$_SESSION['id'] = $row['id']; //���������� � ������ id 				
$id = $_SESSION['id']; 				

lastAct($id); 				
return true; 			
} 			
else //���� ������ �� cookie �� �������, �� ������� ��� ����, ��� ����� ��� ����� ��� �� ����� 			
{ 				
SetCookie("login", "", time() - 360000, '/'); 				

SetCookie("password", "", time() - 360000, '/');	 				
return false; 			

} 		
} 		
else //���� ���� �� ���������� 		
{ 			
return false; 		
} 	
} 
}






?>