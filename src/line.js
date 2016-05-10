
function Line () {
	this.ctx;
	this.options = {};
}

Line.prototype.draw = function () {
	this.ctx.beginPath();
	this.ctx.moveTo(this.options.x, this.options.y);
	this.ctx.lineTo(this.options.w, this.options.h);
	this.ctx.strokeStyle = this.options.color;
	this.ctx.stroke();
	this.ctx.closePath();
}

module.exports = Line;