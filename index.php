<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/x-icon" href="/images/favicon.png">
    <link rel="stylesheet" type="text/css" href="src/styles.css" />
    <script src="src/index.js" defer></script>
    <title>Calculdora</title>
</head>

<body>
    <div id="app">
        <div id="wrapper">
            <?php $buttonContents = array("7","8","9","/","4","5","6","*","1","2","3","-","0",",","=","+")?>
            <span>
                <input type="text" id="display" onpaste="return false" autofocus>
            </span><br>
            <span>
                <input type="button" class="operator" id="setNumber" data-buttons="KeyX" value="M+" title="Gravar (ctrl + x)" disabled>
                <input type="button" class="operator" id="recoverNumber" data-buttons="KeyV" value="MR" title="Recuperar (ctrl + v)" disabled>
                <input type="button" class="operator" value="⇐" data-buttons="Backspace" title="Deletar (Backspace)">
                <input type="button" class="operator" value="C" data-buttons="Escape" title="Limpar (Esc)">
            </span><br>
                <?php for ($i=0; $i < count($buttonContents); $i++) { ?>
                    <?php if ($i==0){echo '<span>';} else {echo ($i)%4==0 ? '<span>':'';} ?>
                    <input
                    type="button"
                    class="<?php
                    if ($buttonContents[$i]=="=") echo "equals";
                    else if (is_numeric($buttonContents[$i])) echo 'numbers';
                    else $buttonContents[$i]=="," ?'comma':'operator';
                    ?>"
                    <?php if ($buttonContents[$i]=="=") echo "data-buttons=\"Enter\""; ?>
                    value="<?php echo $buttonContents[$i]?>">
                    <?php echo ($i+1)%4==0 ?'</span> <br>' :'' ?>
                <?php } ?>
            <footer>
                <p>Desenvolvido por Luciano Minervino</p>
            </footer>
        </div>
    </div>
</body>

</html>