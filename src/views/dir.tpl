<!DOCTYPE html>
<html lan="en">
    <head>
        <meta chatset = "UTF-8"/>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"/>
        <meta http-equiv="Content-Language"content="zh-cn"/>
        <title>{{title}}</title>
        <style>
        body{
            margin:30px;
        }

        div{
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          justify-content: flex-start;  
          align-items:center;
        }

        a{
            display:block;
            font-size:30px;
        }
        </style>
    </head>
    <body>
    {{#each files}}
    <div>
        <img src = "{{host}}{{rativeaddr}}{{icon}}" height="60" width="60"/>
        <a href = "{{../dir}}/{{file}}">{{file}}</a>
    </div>
    {{/each}}
    </body>
</html>