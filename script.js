const t="Hi, I'm Rejaul Karim";let i=0;
function type(){if(i<t.length){typing.textContent+=t.charAt(i++);setTimeout(type,90);}}
type();
document.querySelectorAll('a[href^="#"]').forEach(x=>x.onclick=e=>{e.preventDefault();document.querySelector(x.getAttribute('href')).scrollIntoView({behavior:"smooth"});});