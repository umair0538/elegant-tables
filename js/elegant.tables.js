/*
 * elegant Tables plugin
 * version 1.0
 *
 * Copyright (c) 2013 Umair Shahid (https://github.com/umair0538, umair0538@gmail.com)
 *
 * Licensed under the MIT (MIT-LICENSE.txt)
 *
 * https://github.com/umair0538/elegant-meters
 *
 */

tables = [];
tables_count = 0;

function Table(element, rows, pages, start_page, columns_array, sorting_allowed, src, count){
	this.rows = rows;
	this.pages = pages;
	this.start_page = start_page;
	this.current = start_page;
	this.columns_array = columns_array;
	this.sorting_allowed = sorting_allowed;
	this.order_array = [];
	
	for(i = 0; i < columns_array.length; i++)
		this.order_array[i] = 0;
	
	this.columns = columns.length;
	this.element = element;
	this.src = src;
	this.count = count;
	this.column_order = -1;
	this.order = 0;
	
	this.get_footer = function(){
		footer = '<tr>';
		footer += '<td colspan="'+this.columns+'" class="tbl_footer">';
		footer += 'Total: '+ this.total;
		
		if(Math.ceil((this.total/this.rows)) > 1){
			footer += '<div class="numbering_div">';
			
			if(this.current != 1)
				footer += '<a href="javascript:load_prev(tables['+this.count+']);" class="page_numbering">Prev</a>';
			
			if(Math.ceil((this.total/this.rows)) < this.pages){
				end_count = Math.ceil(this.total/this.rows);
				start_count = 1;
			}else{
				if((this.current - Math.ceil(this.pages/2)) >= 0){
					if((this.current - Math.ceil(this.pages/2)) > (Math.ceil(this.total/this.rows) - this.pages)){
						end_count = Math.ceil(this.total/this.rows);
						start_count = end_count - (this.pages - 1);
					}else{
						start_count = this.current - Math.floor(this.pages/2);
						end_count = start_count + (this.pages - 1);
					}
				}else{
					start_count = 1;
					end_count = start_count + (this.pages - 1);
				}
			}

			for(i = start_count; i <= end_count; i++){
				footer += '<a href="javascript:load_page(tables['+this.count+'], '+i+');" class="page_numbering';
				
				if(this.current == i) footer += ' active_page';
					
				footer += '">'+i+'</a>';
			}
			
			if(this.current != Math.ceil(this.total/this.rows))
				footer += '<a href="javascript:load_next(tables['+this.count+']);" class="page_numbering">Next</a>';
		}
		footer += '</div>';
		footer += '</td>';
		footer += '</tr>';
		
		return footer;
	}
	
	this.get_top_bar = function(){
		top_br = '<tr>';
		top_br += '<td colspan="'+this.columns+'" class="tbl_top_bar">';
		top_br += '<label>Rows: </label>';
		top_br += '<select onchange="tables['+this.count+'].rows = $(this).val(); tables['+this.count+'].current = 1; tables['+this.count+'].load_data();">';
		top_br += '<option>10</option>';
		top_br += '<option>50</option>';
		top_br += '<option>100</option>';
		top_br += '</select>';
		top_br += '<div style="float:right;">';
		top_br += '<input id="tbl_search" type="text" class="tbl_search_text" placeholder="Search"/>';
		top_br += '<input type="image" class="tbl_search_button" src="images/search.png" onclick="tables['+this.count+'].current = 1; tables['+this.count+'].load_data();"/>';
		top_br += '</div>';
		top_br += '</td>';
		top_br += '</tr>';
		
		return top_br;
	}
	
	this.get_headers = function(){
		column_headers = "<tr>";
		for(i = 0; i < this.columns; i++){
			column_headers += '<td class="tbl_header">';
			if(this.sorting_allowed[i] == 1) column_headers += '<a href="javascript:tables['+this.count+'].order_table('+i+');" style="display:block;width:100%;">';
			column_headers += this.columns_array[i]+'<span class="sort_none"></span>';
			if(this.sorting_allowed[i] == 1) column_headers += '</a>';
			column_headers += '</td>';
		}
		
		column_headers += "</tr>";
		
		return column_headers;
	}
	
	this.create = function(){
		this.element.html(this.get_headers());
		$(this.element.find('tr').get(0)).before(this.get_top_bar());
		this.load_data();
	}
	
	this.show_columns = function(data){
		this.element.find(".row").remove();
		this.element.find(".tbl_footer").remove();
		this.element.find(".tbl_loader").remove();
		
		if(data == "")
			$(this.element.find('tr').get(1)).after("<tr><td colspan='"+this.columns+"' class='row even no_data'>No Record Found</td></tr>");
		else
			$(this.element.find('tr').get(1)).after(data);
		number_of_rows = $(this.element.find('tr')).length;
		$(this.element.find('tr').get(number_of_rows - 1)).after(this.get_footer());
	}
	
	this.animate_loader = function(){
		this.element.find(".tbl_loader").remove();
		$(this.element.find('tr').get(1)).after('<tr><td colspan="'+this.columns+'" class="tbl_loader"><img src="images/tbl_loader.gif"/></td></tr>');
	}
	
	this.order_table = function(column_number){
		if(column_number != this.column_order && this.column_order != -1){
			this.order_array[this.column_order] = 0;
			$(this.element.find("td.tbl_header span").get(this.column_order)).removeClass("sort_down");
			$(this.element.find("td.tbl_header span").get(this.column_order)).removeClass("sort_up");
			$(this.element.find("td.tbl_header span").get(this.column_order)).addClass("sort_none");
		}
			
		if(this.order_array[column_number] != 1)
			this.order = this.order_array[column_number] = 1;
		else
			this.order = this.order_array[column_number] = -1;

		this.column_order = column_number;
		
		if(this.order == 1){
			$(this.element.find("td.tbl_header span").get(column_number)).addClass("sort_down");
			$(this.element.find("td.tbl_header span").get(this.column_order)).removeClass("sort_none");
			$(this.element.find("td.tbl_header span").get(this.column_order)).removeClass("sort_up");
		}else{
			$(this.element.find("td.tbl_header span").get(column_number)).addClass("sort_up");
			$(this.element.find("td.tbl_header span").get(this.column_order)).removeClass("sort_down");
			$(this.element.find("td.tbl_header span").get(this.column_order)).removeClass("sort_none");
		}
		
		this.load_data();
	}
	
	this.load_data = function(){
		this.animate_loader();
		this.element.find(".row").remove();
		
		order_string = "";
		if(this.column_order != -1)
			order_string = "&order="+this.column_order+"&asc="+this.order;
		
		$.ajax({
			url: this.src,
			dataType: "json",
			context: this,
			data: "page="+this.current+"&rows="+this.rows+"&random="+Math.random()+"&search="+$("#tbl_search").val()+order_string,
			success: function(data) {
				column_data = "";
				
				$.each(data.rows, function(key, value) { 
					column_data += "<tr>";
					
					if(key % 2 == 0) class_row = "even";
					else class_row = "odd";
					
					$.each(value, function(key1, value1) { 
						column_data += '<td class="row '+class_row+'">'+value1+'</td>';
					});
					
					column_data += "</tr>";
				});
				
				this.total = data.total;
				this.show_columns(column_data);
			}
		});
	}
	
	this.load_page = function(number){
		this.current = number;
		this.load_data();
	}
}

function load_prev(element){
	element.load_page(element.current - 1);
}

function load_page(element, number){
	element.load_page(number);
}

function load_next(element){
	element.load_page(element.current + 1);
}

function TableFactory(options){
	tables[tables_count] = new Table($("#"+options.id), options.number_of_rows, options.pagination_count, options.starting_page, options.columns, options.sorting_allowed, options.src, tables_count);
	tables[tables_count].create();
	tables_count++;
}