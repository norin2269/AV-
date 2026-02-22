const BASE_PRICE = 80000;

const playCategories = {
soft:[
{name:"キス",price:5000},
{name:"ハグ・密着",price:3000},
{name:"デート風演出",price:7000}
],
scene:[
{name:"正常位",price:8000},
{name:"背面位",price:10000},
{name:"騎乗位",price:12000},
{name:"立位",price:15000}
],
costume:[
{name:"ランジェリー演出",price:5000},
{name:"衣装チェンジ",price:6000},
{name:"コスチューム指定",price:8000}
],
direction:[
{name:"カメラ目線重視",price:7000},
{name:"POV風撮影",price:9000},
{name:"ストーリー性重視",price:10000},
{name:"ロケ撮影",price:15000}
]
};

function renderCategories(){
for(const cat in playCategories){
const box=document.querySelector(`[data-cat="${cat}"]`);
playCategories[cat].forEach(item=>{
const label=document.createElement("label");
label.innerHTML=`<input type="checkbox" value="${item.price}"> ${item.name} (+${item.price.toLocaleString()}円)`;
box.appendChild(label);
});
}
}

function calculate(){
let total=BASE_PRICE;
document.querySelectorAll("input[type=checkbox]:checked").forEach(cb=>{
total+=Number(cb.value);
});
const age=Number(document.getElementById("age").value);
if(age&&age<20)total*=0.9;
if(age&&age>=30)total*=1.1;
total=Math.round(total);
document.getElementById("result").innerHTML=`
<h2>診断結果</h2>
<p>想定出演料</p>
<p style="font-size:26px;color:#ff99dd;"><strong>${total.toLocaleString()}円</strong></p>`;
}
renderCategories();
