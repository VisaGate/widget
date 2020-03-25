/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var collect;

beforeAll(function (done) {
	depend(['m3/core/collection'], function (c) {
		collect = c;
		done();
	});
});

describe('Collection', function () {
	it('is created', function () {
		var c;
		var count;
		
		c = collect([1, 2 ,3]);
		count = 0;

		c.each(function () { count++; });
		
		expect(count).toBe(3);
		expect(c.get(0)).toBe(1);
	});
	
	it('can be reduced', function () {
		var c = collect([3, 2, 1]);
		var r = c.reduce(function (c, cur) { return c + cur; }, 0);
		
		expect(r).toBe(6);
	});
	
	it('can be filtered', function () {
		var c = collect([3, 2, 1]).filter(function (e) { return e!= 1; });
		expect(c.length()).toBe(2);
	});
	
	it('can be resized', function () {
		var c = collect([3, 2, 1]);
		c.push(4);
		expect(c.length()).toBe(4);
	});
});