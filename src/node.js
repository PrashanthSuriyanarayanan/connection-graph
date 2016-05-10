
function Node ( options ) {
	this.ctx;
	this.options = {};
}

Node.prototype.drawText = function () {
	this.ctx.fillStyle = this.options.color;
    this.ctx.font = this.options.font;
    this.ctx.textAlign = this.options.textAlign;
    this.ctx.fillText(this.options.name, this.options.x, this.options.y+3);	
}

Node.prototype.drawCircle = function () {
	this.ctx.beginPath();
	
	var grd = this.ctx.createRadialGradient(this.options.x, this.options.y, 100, this.options.x, this.options.y, 0);
	grd.addColorStop(0, this.options.outerFillStyle);
	grd.addColorStop(1, this.options.innerFillStyle);
    
    this.ctx.arc(this.options.x, this.options.y, this.options.radius, 0, 2* Math.PI);
    this.ctx.fillStyle = grd;  

    this.ctx.fill();
	this.ctx.closePath();
}

Node.prototype.draw = function () {
	this.drawText();
	this.drawCircle();
}

module.exports = Node;
