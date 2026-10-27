(function(){
"use strict";
var d=document,root=d.documentElement;root.classList.add("js");
var reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
function $(s,c){return (c||d).querySelector(s)}function $$(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))}

/* preloader (jen úvod, jednou za návštěvu) */
var pre=$("#pre");
if(pre){var seen=false;try{seen=sessionStorage.getItem("av-pre")==="1";sessionStorage.setItem("av-pre","1")}catch(e){}
  if(reduce||seen){pre.remove()}else{var n=$("#preN"),t0=performance.now(),D=1100;(function tick(t){var k=Math.min(1,(t-t0)/D);n.textContent=String(Math.round(k*k*(3-2*k)*100)).padStart(3,"0");if(k<1)requestAnimationFrame(tick);else{pre.classList.add("done");setTimeout(function(){pre.remove()},1100)}})(t0)}}

/* menu */
var menu=$("#menu"),mb=$("#menuBtn");
function toggleMenu(o){menu.classList.toggle("open",o);mb.setAttribute("aria-expanded",o);d.body.style.overflow=o?"hidden":"";if(o)$("#menuClose").focus();else mb.focus()}
if(menu){mb.onclick=function(){toggleMenu(true)};$("#menuClose").onclick=function(){toggleMenu(false)};$$("nav a",menu).forEach(function(a){a.addEventListener("click",function(){toggleMenu(false)})})}

/* kurzor + náhled u seznamu */
var cur=$("#cur"),peek=$("#peek"),peekImg=peek&&$("img",peek),tx=0,ty=0,cx=0,cy=0,px=0,py=0;
addEventListener("mousemove",function(e){tx=e.clientX;ty=e.clientY;cur&&cur.classList.add("live")});
d.addEventListener("mouseover",function(e){cur&&cur.classList.toggle("big",!!e.target.closest(".card,.stage,.case .media,.sgal figure"))});
(function loop(){cx+=(tx-cx)*.35;cy+=(ty-cy)*.35;px+=(tx-px)*.14;py+=(ty-py)*.14;if(cur){cur.style.left=cx+"px";cur.style.top=cy+"px"}if(peek){peek.style.left=px+"px";peek.style.top=py+"px"}requestAnimationFrame(loop)})();

/* lightbox */
var lb=$("#lb"),lbImg=lb&&$("#lbImg"),set=[],li=0,last;
function openLb(items,i){set=items;li=i;last=d.activeElement;render();lb.classList.add("open");d.body.style.overflow="hidden";$("#lbX").focus()}
function render(){var it=set[li];lbImg.src=it.full;lbImg.alt=it.alt;$("#lbT").textContent=it.t;$("#lbM").textContent=it.m||"";$("#lbN").textContent=(li+1)+" / "+set.length}
function step(k){li=(li+k+set.length)%set.length;render()}
function closeLb(){lb.classList.remove("open");d.body.style.overflow="";last&&last.focus()}
if(lb){$("#lbX").onclick=closeLb;$("#lbP").onclick=function(){step(-1)};$("#lbNx").onclick=function(){step(1)};lb.addEventListener("click",function(e){if(e.target===lb||e.target.tagName==="FIGURE")closeLb()})}
addEventListener("keydown",function(e){if(lb&&lb.classList.contains("open")){if(e.key==="Escape")closeLb();if(e.key==="ArrowRight")step(1);if(e.key==="ArrowLeft")step(-1)}else if(menu&&menu.classList.contains("open")&&e.key==="Escape")toggleMenu(false)});
function itemOf(el){return{full:el.getAttribute("data-full"),alt:($("img",el)||{}).alt||"",t:el.getAttribute("data-t"),m:el.getAttribute("data-m")}}

/* galerie */
$$("[data-gallery]").forEach(function(g){
  var grid=$(".grid",g),list=$(".list",g),filters=$(".filters",g),moreBtn=$(".more button",g),active="all",expanded=!moreBtn;
  var cards=$$(".card",grid),rows=list?$$(".row",list):[];
  function vis(){return cards.filter(function(c){return !c.classList.contains("hide")&&!c.classList.contains("more-hidden")})}
  function apply(){cards.concat(rows).forEach(function(el){var off=active!=="all"&&el.dataset.c!==active;el.classList.toggle("hide",off);el.classList.toggle("more-hidden",!expanded&&el.dataset.extra==="1"&&active==="all")});
    if(moreBtn)moreBtn.parentNode.hidden=expanded||active!=="all"}
  if(filters)filters.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;active=b.dataset.f;$$("button",filters).forEach(function(x){x.setAttribute("aria-pressed",x===b)});apply()});
  if(moreBtn)moreBtn.addEventListener("click",function(){expanded=true;apply();var first=cards.filter(function(c){return c.dataset.extra==="1"})[0];first&&first.focus({preventScroll:true})});
  var views=$(".views",g);if(views)views.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;var v=b.dataset.view;$$("button",views).forEach(function(x){x.setAttribute("aria-pressed",x===b)});grid.hidden=v!=="grid";list.hidden=v!=="list";if(v==="list"){expanded=true;apply()}});
  function open(el){var src=el.closest(".row")?rows:cards;var shown=src.filter(function(c){return !c.classList.contains("hide")&&!c.classList.contains("more-hidden")});openLb(shown.map(itemOf),shown.indexOf(el))}
  [grid,list].forEach(function(c){if(!c)return;c.addEventListener("click",function(e){var t=e.target.closest("[data-full]");if(t)open(t)});c.addEventListener("keydown",function(e){if(e.key==="Enter"){var t=e.target.closest("[data-full]");if(t)open(t)}})});
  if(list&&peek){list.addEventListener("mouseover",function(e){var r=e.target.closest(".row");if(!r)return;peekImg.src=r.getAttribute("data-thumb");peek.classList.add("on")});list.addEventListener("mouseleave",function(){peek.classList.remove("on")})}
  var h=location.hash.replace("#","");if(h&&filters){var b=$('[data-f="'+h+'"]',filters);b&&b.click()}
  apply();
});
$$(".sgal").forEach(function(g){var figs=$$("figure",g);g.addEventListener("click",function(e){var f=e.target.closest("figure");if(f)openLb(figs.map(itemOf),figs.indexOf(f))})});

/* hero slideshow */
var stage=$("#stage");
if(stage){var ims=$$("img",stage),dots=$$("#stageDots button"),cap=$("#stageCap"),i=0,timer;
  function show(k,user){ims[i].classList.remove("on");dots[i].classList.remove("on");i=k;ims[i].classList.add("on");dots[i].classList.add("on");cap.textContent=ims[i].getAttribute("data-cap");if(user){clearInterval(timer);start()}}
  function start(){if(!reduce)timer=setInterval(function(){show((i+1)%ims.length)},5200)}
  dots.forEach(function(b,k){b.onclick=function(){show(k,true)}});start()}

/* odhalení při posunu */
if("IntersectionObserver" in window&&!reduce){var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.remove("wait");io.unobserve(en.target)}})},{rootMargin:"0px 0px -8% 0px"});
  $$(".rv").forEach(function(el){if(el.getBoundingClientRect().top>innerHeight){el.classList.add("wait");io.observe(el)}})}

/* formulář */
var form=$("#form");if(form)form.addEventListener("submit",function(e){var m=$("#f-mail"),n=$("#formNote");if(!/.+@.+\..+/.test(m.value)){e.preventDefault();n.textContent="Doplňte e-mail, ať vám máme kam poslat nabídku.";m.focus();return}
  var f=$("#f-file");if(f&&f.files){var sum=0;for(var k=0;k<f.files.length;k++)sum+=f.files[k].size;if(sum>10*1024*1024){e.preventDefault();n.textContent="Soubory mají dohromady přes 10 MB. Pošlete prosím odkaz na úložiště do zprávy.";return}}
  n.textContent="Odesílám…"});
})();
