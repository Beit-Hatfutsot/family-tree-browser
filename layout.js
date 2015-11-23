/**
 * Family tree layout engine
 */
;FTreeLayouter = (function(){
	var C = function(){ return constructor.apply(this,arguments); }
	var p = C.prototype;

	//list the attributes
	p.chartSize;
	p.options;

	//construct
	function constructor(chartSize, layoutOptions){
		this.chartSize = chartSize;
		this.options = layoutOptions;
	}

	//define methods
	p.layoutNode = function(node){
		var center = this.chartSize.mult(0.5);
		var o = this.options.options;
		node.pos = center.minus(o.individualSize.mult(0.5));
		node.size = o.individualSize;
		if ( node.parents ) {
			numParents = node.parents.length;
			if ( numParents>0 ) {
				var box = new Tuple(o.parentSize.x*numParents + o.parentMargin.horizontal*(numParents-1),
									o.parentSize.y + o.parentMargin.bottom);
				var left = center.x - box.x/2;
				var top = node.pos.y - box.y;
				for ( _parent in node.parents ) {
					var parent = node.parents[_parent];
					parent.pos = new Tuple(left,top);
					parent.size = o.parentSize;
					left += o.parentSize.x + o.parentMargin.horizontal;
				}
			}
		}
		if ( node.partners ) {
			numPartners = node.partners.length;
			if ( numPartners>0 ) {
				var box = new Tuple(o.partnerSize.x*numPartners + o.partnerMargin.horizontal*(numPartners-1),
									o.partnerSize.y);
				var left = node.pos.x + box.x + o.partnerMargin.left;
				var top = center.y - box.y/2;
				for ( _partner in node.partners ) {
					var partner = node.partners[_partner];
					partner.pos = new Tuple(left,top);
					partner.size = o.partnerSize;
					left += o.partnerSize.x + o.partnerMargin.horizontal;
				}
			}
		}
		if ( node.children ) {
			numChildren = node.children.length;
			if ( numChildren>0 ) {
				var childrenPerRow = Math.floor((this.chartSize.x+o.childMargin.horizontal) / o.childSize.x);
				if ( childrenPerRow < 1 ) { childrenPerRow = 1; };
				var idx = 0;
				var top = node.pos.y + node.size.y + o.childMargin.top;
				while ( numChildren > 0 ) {
					var rowSize = numChildren > childrenPerRow ? childrenPerRow : numChildren;
					var box = new Tuple(o.childSize.x*rowSize + o.childMargin.horizontal*(rowSize-1),
										o.childSize.y + o.childMargin.vertical);
					var left = center.x - box.x/2;
					while ( rowSize > 0 ) {
						var child = node.children[idx];
						numChildren --;
						rowSize --;
						idx ++;
						child.pos = new Tuple(left,top);
						child.size = o.childSize;
						left += o.childSize.x + o.childMargin.horizontal;
					}
					top += o.childMargin.vertical + o.childSize.y;
				}
			}
		}
		if ( node.siblings ) {
			numSiblings = node.siblings.length;
			if ( numSiblings>0 ) {
				var siblingsPerColumns = Math.floor((o.individualSize.y+o.parentMargin.bottom/2+o.childMargin.top/2+o.siblingMargin.horizontal) /
													(o.siblingSize.y + o.siblingMargin.horizontal));
				if ( siblingsPerColumns < 1 ) { siblingsPerColumns = 1; };
				var idx = 0;
				var left = node.pos.x - o.siblingMargin.right - o.siblingSize.x;
				while ( numSiblings > 0 ) {
					var colSize = numSiblings > siblingsPerColumns ? siblingsPerColumns : numSiblings;
					var box = new Tuple(o.siblingSize.x,
										o.siblingSize.y*colSize + o.siblingMargin.horizontal*(colSize-1));
					var top = center.y - box.y/2;
					while ( colSize > 0 ) {
						var sibling = node.siblings[idx];
						numSiblings --;
						colSize --;
						idx ++;
						sibling.pos = new Tuple(left,top);
						sibling.size = o.siblingSize;
						top += o.siblingMargin.vertical + o.siblingSize.y;
					}
					left -= o.siblingSize.x + o.siblingMargin.horizontal;
				}
			}
		}

	}

	//unleash your class
	return C;
})();
