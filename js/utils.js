function rand(min, max){
	return Math.floor(Math.random() * max) + min;
}

Array.prototype.random = function(){
	return this[Math.floor(Math.random() * this.length)];
}

function Level(type, number, boss, pos){
	this.type   = type;
	this.number = number;
	this.boss   = boss;
	this.pos    = pos;
}
