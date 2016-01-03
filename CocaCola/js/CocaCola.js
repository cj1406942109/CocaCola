/**
 * Created by dushang on 23/11/15.
 */

/*获取页面宽度*/
function getPageWidth(){
    return $(window).width();
}

var pageWidth=getPageWidth();
var factor=pageWidth/640;


$(document).ready(function(){

    /*绑定点击事件*/
    $("#startBtn").on('click',startGame);

    /*延迟显示游戏提示信息*/
    $(".gameInfo").animate({opacity:"1"},2000,function(){
        $("#colaBottle").animate({opacity:"1"},2000,function(){
            $("#startBtn").animate({opacity:"1"},2000);
        })
    });

});

function startGame (){

    /*更改背景图片*/
    $("#main_bg").attr("src","images/main_bg1.png");
    /*隐藏提示信息*/
    $(".colaBottle").attr("src","images/bottle/0.png");

    /*隐藏游戏标题*/
    $("#gameTitle").fadeOut(1000,function(){
        $("#countDown").fadeIn(1000);

    });

    /*显示小熊*/
    $("#bearStand").css("visibility","visible");
    /*显示当前高度*/
    $("#currentHeight").css("visibility","visible");
    /*计时器显示剩余充能时间*/
    var count=4;/*剩余充气时间*/
    var interval1;/*定义定时器变量*/
    $(".showTime").fadeOut(1000,function(){

        /*调用函数记录晃动次数*/
        shakeRecord();

        $(".showTime").attr("src","images/number/5.png")
            .fadeIn(100,function(){
                interval1=setInterval(changeTime,1000); /*设置定时器每秒调用更改时间函数*/
            });
    });

    /*更改显示时间*/
    function changeTime(){
        $(".showTime").attr("src","images/number/"+count+".png");
        count--;
    }

    setTimeout(function(){
        /*清除定时器*/
        clearInterval(interval1);
        /*隐藏时间显示*/
        $(".showTime").animate({opacity:"0"},1000);
        $("#countDown").fadeOut(1000,function(){
            $("#lunchInfo").fadeIn(1000,function(){
                $("#lunchInfo").fadeOut(2000,function(){
                    /*设置禁止竖直方向滑动*/
                    $("body").css("overflowY","hidden");
                    window.ontouchmove=function(e){
                        e.preventDefault && e.preventDefault();
                        e.returnValue=false;
                        e.stopPropagation && e.stopPropagation();
                        return false;
                    };
                    /*发射小熊*/
                    $("#bear").animate({top:-100*factor+"px"},1000,function(){
                        /*动画结束，背景下拉*/
                        bearFly();
                        $("#colaBottle").css("visibility","hidden");
                    });
                    setTimeout(function(){
                        $("#bearStand").attr("src","images/bear/bearFly.gif");
                    },500);

                    /*切换开罐图*/
                    var n=0;
                    var interval;
                    interval=setInterval(function(){
                        $(".colaBottle").attr("src","images/bottle/open"+n+".png");
                        n++;
                        if(n==7){
                            clearInterval(interval);
                        }
                    },100);
                    /*切换出长背景图*/
                    $("#main_bg").fadeOut();
                    $("#long_bg").fadeIn();


                });
            });
        });
    },7000);
}


/*记录手机晃动次数*/

var shakeTime=0;/*定义全局变量，手机晃动次数*/


function shakeRecord(){

    var myShakeEvent = new Shake({
        threshold: 15, // optional shake strength threshold
        timeout: 200 // optional, determines the frequency of event generation
    });

    /*开始监听设备*/
    myShakeEvent.start();

    window.addEventListener('shake', shakeEventDidOccur, false);

    /*晃动可乐瓶*/
    function shakeBottle(){
        var num=0;
        var flag=true;/*flag为true时，num++，flag为false时，num--*/
        var changeTime=0;

        setTimeout(shakeOneTime,100);
        var Interval;

        function shakeOneTime(){
            Interval=setInterval(changeBottle,50);
            function changeBottle(){
                if(flag){
                    /*更改图片地址*/
                    $(".colaBottle").attr("src","images/bottle/"+num+".png");
                    num++;
                    if(num==2){
                        flag=false;
                    }
                }else{
                    /*更改图片地址*/
                    $(".colaBottle").attr("src","images/bottle/"+num+".png");
                    num--;
                    if(num==-2){
                        flag=true;
                    }
                }
                changeTime++;
                if(changeTime>=21){
                    clearInterval(Interval);
                }
            }
        }
    }


    //function to call when shake occurs
    function shakeEventDidOccur () {
        //put your own code here etc.
        shakeBottle();
        shakeTime++;
    }

    setTimeout(function(){

        /*停止监听晃动事件*/
        window.removeEventListener('shake', shakeEventDidOccur, false);
        /*解除点击事件绑定*/
        $("#startBtn").off('click',startGame);

    },5000);

    /*返回晃动次数*/
    this.getShakeTime=function(){
        return shakeTime;
    }
}
/*小熊发射*/
function bearFly(){
    var height=-7964*factor;
    var interval1;
    /*小熊初始速度为玩家摇晃手机的次数*/
    var bgSpeed = 5;
    bgSpeed=bgSpeed+shakeTime;
    interval1=setInterval(scroll,20);/*修改背景下滑速度*/
    changeRandomObj();

    /*背景图片向下滚动*/
    function scroll(){
        /*显示当前高度*/
        $("#heightNum").html(parseInt((height+7964*factor)*4));

        $("#long_bg").css('top',height+"px");
        height=height+bgSpeed*factor;
        bgSpeed-=0.03;

        /*当图片滚动到顶部或速度为0时，停止滚动*/
        if(height>=-0||bgSpeed<=0){
            clearInterval(interval1);

            /*停止动画*/
            $("#randomObj").stop()
                .fadeOut(100);/*清除随机物品*/
            /*小熊停止移动*/
            $("#bearStand").attr("src","images/bear/bearFly1.png");
            /*显示用户得分*/

            setTimeout(function(){
                var grade;
                if(shakeTime==0){
                    grade=parseInt(-height/10);
                }
                else{
                    grade=(shakeTime-1)*1000+getRandom(1000);
                }
                $(".gameInfo").html("<span>圣诞快乐！</span></br><span>您的成绩是："+grade+"分</span>")
                    .find("span").css({"fontSize":50*factor+"px","color":"yellow"});

            },500);

        }
    }

    var randomNum;/*定义随机数变量*/
    /*生成随机数字*/
    function getRandom(n){
        return parseInt(Math.floor(Math.random()*n+1));
    }

    /*随机物品可见性改为可见*/
    $("#randomObj").css("visibility","visible");
    /*随机出现加速或减速物品*/
    function changeRandomObj(){


        randomNum=getRandom(12);

        $("#randomObj").attr("src","images/randomObj/"+randomNum+".png");
        /*随机物品移动*/
        randomObjMove();
    }

    /*
     * randomNum
     * 在随机物品中选择，总加速的概率不超过5%；
     * 判断randomNum在加速范围还是在减速范围
     * */
    function randomObjMove(){
        $("#randomObj").animate({marginRight:260*factor,marginTop:350*factor},3000,function(){
            /*随机物品为加速物品*/
            if(randomNum>=1&&randomNum<=2){
                /*小熊加速*/
                bgSpeed+=4;
            }
            /*随机物品为减速物品*/
            else if(randomNum>=3&&randomNum<=12){
                /*小熊减速*/
                bgSpeed-=2;
            }
            /*随机物品消失*/
            $("#randomObj").css("visibility","hidden")
                .animate({marginRight:0,marginTop:0},1);
            setTimeout(function(){
                $("#randomObj").css("visibility","visible");
                changeRandomObj();
            },2000)
        });
    }

}
function test(){
    var obj= shakeRecord;
    var fn=new obj;
    window.alert(fn.getShakeTime());
}



/*去除覆盖div*/
function clearDiv(){
    $("#noOperate").hide();
}

/*设置页面适应手机屏幕*/

function changeWidthHeight(){

    $("body").width(640*factor+"px")
        .height(1136*factor+"px");
    $("#noOperate").width(640*factor+"px")
        .height(1136*factor+"px")
        .css({"fontSize":50*factor+"px","top":0});
    $("#vPosition").css({"top":250*factor+"px"});

    $("#bgImg").attr({width:640*factor+"px",height:1136*factor+"px"});
    $("#main_bg").attr({width:640*factor+"px",height:1136*factor+"px"});
    $("#long_bg").attr({width:640*factor+"px",height:9100*factor+"px"})
        .css({"top":-7964*factor+"px"});

    /*$("#bgImg").height(1136*factor+"px")
        .width(640*factor+"px");
    $("#main_bg").height(1136*factor+"px")
        .width(640*factor+"px");*/
    $("#mainPage").width(640*factor+"px");

    $("#currentHeight").css({"fontSize":30*factor+"px"});

    $(".gameInfo").width(640*factor+"px")
        .height(140*factor+"px")
        .css("marginTop",120*factor+"px")
        .find("img").attr({width:640*factor+"px",height:140*factor+"px"});
    $("#countDown").height(140*factor+"px")
        .width(640*factor+"px");
    $("#lunchInfo").height(140*factor+"px")
        .width(640*factor+"px");

    $("#randomThings").width(640*factor+"px")
        .height(100*factor+"px");

    $("#startBtn").width(640*factor+"px")
        .height(120*factor+"px")
        .css("marginTop",100*factor+"px");
        /*.find("img").attr({width:282*factor+"px",height:116*factor+"px"});*/
    $(".showTime").height(120*factor+"px");

    $("#bear").width(150*factor+"px")
        .height(150*factor+"px")
        .css({"top":60*factor+"px","left":250*factor+"px"});
    $("#bearStand").width(150*factor+"px")
        .height(150*factor+"px");

    $("#colaBottle").width(640*factor+"px")
        .height(380*factor+"px")
        .css("marginTop",0);
    $(".colaBottle").height(380*factor+"px");

    clearDiv();

}
