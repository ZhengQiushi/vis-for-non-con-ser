function add_router(vis_g, route_id, my_graph, vis_pos, start, end){
    /*
     * brief@ 画布上加一个路由
     * params@ vis_g 画布
     *         route_id 路由编号
     *         my_graph 算法逻辑
     *         vis_pos  路由位置
     */
    var x = vis_pos.x;
    var y = vis_pos.y;

    var cur_route_table = my_graph.route_table[route_id]
    var cur_router_name = String.fromCharCode(65 + route_id - 1);


    var image_dir = "img/router.png";
    var node_name_id = "router-" + cur_router_name;
    var node_name = "router"+cur_router_name;

    var node_label = node_name;

    if(start == route_id){
        image_dir = "img/server.png";
        node_label ="PC1";
        //node_name_id = node_name = "PC-1";
    }
    else if(end == route_id){
        image_dir = "img/server.png";
        node_label ="PC2";
        //node_name_id = node_name = "PC-2";
    }

    var render = function(r, n) {
        /* 自定义路由的样子 */
            /* step1: 往r这个raphael set里添加图形 */
            // var set = r.set()
            //     .push(r.rect(n.point[0]-30, n.point[1]-13, 62, 66).attr({"fill": "#fff", "stroke-width": 2, r : "9px", "x": x,"y":y }))
            //     .push(r.text(n.point[0], n.point[1] + 20, n.label).attr({"font-size":"14px",  "x": x + 10,"y": y - 10}));
            var set = r.set()
                    .push(r.text(n.point[0], n.point[1] + 20, n.label).attr({"font-size":"14px",  "x": x + 10,"y": y - 10}))
                    .push(r.image(image_dir, n.point[0] - 30, n.point[1] - 13, 64, 64).attr({"x": x,"y":y}))
                    .push(r.rect(n.point[0]-30, n.point[1]-13, 62, 66).attr({"fill": "#fff", "stroke-width": 2, r : "9px", "x": x,"y":y ,"fill-opacity": .4}))

            let i = 0;
            /* step2: 如果需要修改其属性，通过items[xxx].node 进行 setAttribute*/
            set.items.forEach(function(el) {

                /*添加底色*/
                var rect_ = r.rect(0, 0, 80, 100).attr({"fill": "#fec", "stroke-width": 1, r : "9px", "x": -50, "y": -100 })
                var tooltip = r.set().push(rect_);
                //同时删除提示框
                tooltip.items[tooltip.items.length - 1].node.setAttribute("class", "router"+ cur_router_name);

                /*添加路由表内容*/
                var total_table_contents = ""
                for(let i = 1 ; i <= 6; i ++){
                    var cur_line = " " + String.fromCharCode(65 + i - 1) + ": " + String.fromCharCode(65 + cur_route_table.get_route(i) - 1) +"\n";
                    total_table_contents += cur_line;
                };
                var text_ = r.text(n.point[0], n.point[1] + 20, total_table_contents).attr({"x": -25, "y": -50 })         
                tooltip.push(text_)
                tooltip.items[tooltip.items.length - 1].node.setAttribute("class", "router"+ cur_router_name);

                /* 使这一个单元变成tooltip */
                //el.tooltip(tooltip)
                el.node.setAttribute("id", node_name_id)
                el.node.setAttribute("class", "router")
            });
            return set;
        };

    vis_g.addNode(node_name, {
        label : node_label,
        render : render
    });
}


function add_server(vis_g, cur_server_name, vis_pos){
    var x = vis_pos.x;
    var y = vis_pos.y;

    var render = function(r, n) {
        /* 自定义路由的样子 */
            var set = r.set()
                .push(r.rect(n.point[0]-30, n.point[1]-13, 62, 66).attr({"fill": "#fff", "stroke-width": 2, r : "9px", "x": x,"y":y }))
                .push(r.text(n.point[0], n.point[1] + 20, n.label).attr({"font-size":"14px",  "x": x + 10,"y": y - 10}))
                .push(r.image("img/server.png", n.point[0] - 30, n.point[1] - 13, 64, 64).attr({"x": x,"y":y}))
                set.items.forEach(function(el) {
                    el.node.setAttribute("class", "router")
                });
            return set;
        };

    vis_g.addNode(cur_server_name, {
        label : cur_server_name,
        render : render
    });

}




function add_dustbin(vis_g, vis_pos){
    var x = vis_pos.x;
    var y = vis_pos.y;

    console.log("dustbin: ");

    var render = function(r, n) {
        /* 自定义路由的样子 */
            var set = r.set()
                .push(r.rect(n.point[0]-30, n.point[1]-13, 62, 66).attr({"fill": "#fff", "stroke-width": 2, r : "9px", "x": x,"y":y }))
                .push(r.text(n.point[0], n.point[1] + 20, n.label).attr({"font-size":"14px",  "x": x + 10,"y": y - 10}))
                .push(r.image("img/dustbin.png", n.point[0] - 30, n.point[1] - 13, 50, 50).attr({"x": x + 5,"y":y + 10}))
                ; 
            return set;
        };

    vis_g.addNode("dustbin", {
        label : "dustbin",
        render : render
    });
}

function update_router(route_id, my_graph){
    /*
     * brief@ 更新画布中，路由表的tooltip显示内容
     * params@ 
     *         route_id 路由编号
     *         my_graph 算法逻辑
     */
    /* 找到当前路由表 */
    var cur_route_table = my_graph.route_table[route_id]

    /*添加路由表内容，注意一定使<tspan> !!!*/
    var total_table_contents = ""
    for(let i = 1 ; i <= 6; i ++){

        if(my_graph.route_table[i].removed == true)
            continue;

        var cur_line = "<tspan> " + String.fromCharCode(65 + i - 1) + ": " + String.fromCharCode(65 + cur_route_table.get_route(i) - 1) +"</tspan>\n";
        total_table_contents += cur_line;
    };
    /* 通过jquery 修改内容 */
    var cur_pack_name = "router" + String.fromCharCode(65 + route_id - 1);
    $("." + cur_pack_name).html(total_table_contents);
}


function find_cur_edge_pack(from, to, cur_all_pack){
    /*
     * brief@ 找到某一条边上的所有包
     * params@ from, to 路由编号
     *         cur_all_pack 当前仍存在的所有包
     * return@ 返回所有包
     */
    var cur_edge_pack = [];
    /* 遍历，核对两个端点是否与期望一致 */
    cur_all_pack.forEach(ele => {
        var cur_ele_pos = ele.get_pos();
        if(cur_ele_pos[0] == from && cur_ele_pos[1] == to){
            cur_edge_pack.push(ele);

        }
    });
    return cur_edge_pack;
}

function add_pack_edge(vis_g, from, to, my_graph, vis_pos_from, vis_pos_to){
    /*
     * brief@ 画布上，路由之间连线（并设置一个顶点，用于显示当前该边上的包）
     *        边上的数为当前边上的包个数，点击可以看到具体内容 PAK: 3 (from A) 意思是：当前包号为3，上一时刻从A来
     * params@ vis_g 画布
     *         from, to 路由编号
     *         my_graph 算法逻辑
     *         vis_pos  路由位置
     */
    var y_offset = 50;
    /* 两路由之间 */
    var x = (vis_pos_from.x + vis_pos_to.x) / 2;
    var y = (vis_pos_from.y + vis_pos_to.y) / 2 - y_offset;
    
    var cur_all_pack = my_graph.cur_all_pack_pos;

    /* 找到所有落在这里的包 */
    var cur_edge_pack = find_cur_edge_pack(from, to, cur_all_pack);

    var cur_pack_name = "edge_" + from + "-" + to;
    var from_route_name =  "router" + String.fromCharCode(65 + from - 1);
    var to_route_name = "router" + String.fromCharCode(65 + to - 1);

    var render = function(r, n) {
            var set = r.set()
                .push(r.rect(n.point[0]-30, n.point[1]-13, 10, 10).attr({"fill": "#fff", "stroke-width": 2, r : "9px", "x": x,"y":y }))
                .push(r.text(n.point[0], n.point[1] + 20, n.label).attr({"font-size":"14px",  "x": x + 10,"y": y - 10}));
            
            /* 给线上的文字起名，方便实时更新包个数 */
            set.items[1].node.setAttribute("class", cur_pack_name+"_num");
            var rect_ = r.rect(0, 0, 80, 100).attr({"fill": "#fec", "stroke-width": 1, r : "9px", "x": -50, "y": -100 })

            // /* 添加包点提示 */
            var tooltip = r.set().push(rect_);


            /*添加包节点内容*/
            var total_pack_contents = ""
            for(let i = 1 ; i <= cur_edge_pack.length; i ++){
                var cur_line = " " + cur_edge_pack[i] +"\n";
                total_pack_contents += cur_line;
            };
            var text_ = r.text(n.point[0], n.point[1] + 20, total_pack_contents).attr({"x": -10, "y": -75 })         
            tooltip.push(text_)

            /* 给包点的文字起名，方便实时更新包点提示 */
            tooltip.items[tooltip.items.length - 1].node.setAttribute("class", cur_pack_name);

            //set.items[0].tooltip(tooltip);

            set.items[0].node.setAttribute("class", cur_pack_name + " pack_edge");

            set.items[0].deleteMenu(tooltip);


            return set;
        };

    

    vis_g.addNode(cur_pack_name, {
        label : "num:" + cur_edge_pack.length,
        render : render
    });

    /* 别忘了加边连起来 */
    vis_g.addEdge(from_route_name, cur_pack_name);
    vis_g.addEdge(to_route_name, cur_pack_name);
}

function update_pack_edge(from, to, my_graph){
    /*
     * brief@ 更新画布中，更新边上的包数量以及相应的提示
     * params@ 
     *         from, to 路由编号
     *         my_graph 算法逻辑
     */
    if(from > to){
        [from, to] = [to, from];
    }
    var cur_all_pack = my_graph.cur_all_pack_pos;
    //console.log(cur_all_pack);

    var cur_edge_pack = find_cur_edge_pack(from, to, cur_all_pack);
    cur_edge_pack = cur_edge_pack.concat(find_cur_edge_pack(to, from, cur_all_pack))
    /*添加包节点内容*/
    var total_pack_contents = ""
    for(let i = 0 ; i < cur_edge_pack.length; i ++){
        var ele = cur_edge_pack[i].get_pos();
        var cur_line = "<tspan> PAK: " + cur_edge_pack[i].id + "( from " + String.fromCharCode(65 + ele[0] - 1) +") </tspan>" +"\n";
        total_pack_contents += cur_line;
    };

   

    var cur_pack_name = "edge_" + from + "-" + to;

    // console.log("cur_pack_name: " + cur_pack_name, cur_edge_pack);

    $("." + cur_pack_name).html(total_pack_contents);
    $("." + cur_pack_name + "_num").html("<tspan>" + "num: " + cur_edge_pack.length + "</tspan>");

}

function add_package(vis_g, pack_id, vis_pos){    
    /*
    * brief@ 画布上，路由之间连线（并设置一个顶点，用于显示当前该边上的包）
    *        边上的数为当前边上的包个数，点击可以看到具体内容 PAK: 3 (from A) 意思是：当前包号为3，上一时刻从A来
    * params@ vis_g 画布
    *         pack_id  包编号
    *         my_graph 算法逻辑
    *         vis_pos  路由位置
    */
    /* 起始 */
    // var x = vis_pos[1].x;
    // var y = vis_pos[1].y;

    var cur_pack_name = "pack_" + pack_id;

    /* 给不同的包随机上色 */
    var randomColor = Math.floor(Math.random()*16777215); 
    var textColor = 256*256*256 - randomColor;

    var render = function(r, n) {
            var set = r.set()
                .push(r.circle(0, 0, 30).attr({"fill": "#"+randomColor.toString(16), "stroke-width": 2, "cx": vis_pos.x, "cy": vis_pos.y, "fill-opacity": .4}))
                .push(r.text(n.point[0], n.point[1] + 20, n.label).attr({"font-size":"14px", "font-color": "#" + textColor, "x": vis_pos.x, "y": vis_pos.y}));
                
            set.items[0].node.setAttribute("id", cur_pack_name);
            set.items[0].node.setAttribute("class",  "pack "+cur_pack_name);
            set.items[1].node.setAttribute("class",  "pack "+cur_pack_name);
            return set;
    };
    
    vis_g.addNode(cur_pack_name, {
        label : cur_pack_name,
        render : render
    });               
};

function del_router(vis_g, route_id){
    /*
    * brief@ 画布上，删除一个路由
    * params@ vis_g 画布
    *         route_id  包编号
    */
    var cur_router_name = "router" + String.fromCharCode(65 + route_id - 1);

    
    $("." + cur_router_name).hide();
    $("." + cur_router_name).remove();

    if(vis_g.nodes[cur_router_name] == undefined){
        /* 已经被删了 */
        return;
    } 
    /* 找到以该点出发的所有另一端， 因为一个路由，直接连着用于提示的包点结点， 删除一个路由，意味着也要把相邻的所有包点删除 */
    var cur_pack_edge = vis_g.nodes[cur_router_name].edges;

    for(let i = 0 ; i < cur_pack_edge.length; i ++ ){
        var pack_edge_id = cur_pack_edge[i].target.id;
        /* 把相邻的所有包点删除 */
        vis_g.deleteNode(pack_edge_id);
        i -- ;
    }
    /* 删除本身路由结点 */
    vis_g.deleteNode(cur_router_name);
}

function del_pack(vis_g, pack_id){
    /*
    * brief@ 画布上，删除一个数据包
    * params@ vis_g 画布
    *         pack_id  包编号
    */
    vis_g.deleteNode("pack_" + pack_id);
}

function del_pack_edge(vis_g, pack_id){
    /*
    * brief@ 画布上，删除边
    * params@ vis_g 画布
    *         pack_id  包编号
    */
    vis_g.deleteNode(pack_id);
}
function del_pack_edge(vis_g, from, to){
    /*
    * brief@ 画布上，删除边
    * params@ vis_g 画布
    *         pack_id  包编号
    */
    vis_g.deleteNode("edge_" + from + "-" + to);
}


function sleep(ms) {
    // 延时函数
    return new Promise(resolve => setTimeout(resolve, ms));
}



async function pack_move_anime(vis_g, pack_id, vis_from, vis_to, speed = 500){
    /*
    * brief@ 数据包移动动画
    * params@ vis_g 画布
    *         pack_id  包编号
    *         cur_pos  该包的当前位置(from,to)
    *         vis_pos_ 路由位置
    *         speed    移动速度
    */
    var pack_name = "pack_" + pack_id;

    /* 为了让包不重合的太近，加了一个偏移量 */
    var offset_cood = Math.random() * 10;

    var from_route;

    console.log("vis_from: " , vis_from)
    $("rect.router").each(function(){
        
        if($(this).attr("id") == "router-" + String.fromCharCode(64 + vis_from)){
            from_route = new vis_pos(Math.floor($(this).attr("x")), Math.floor($(this).attr("y")));//vis_from;
            
            return;
        }
    });


    //console.log(vis_from, "rect#router-" + String.fromCharCode(64 + vis_from)+ ".router");

    var pack_edge_name1 = "edge_"+vis_from+"-"+vis_to;
    var pack_edge_name2 = "edge_"+vis_to+"-"+vis_from;


    // console.log("rect." + pack_edge_name1, '$("rect." + pack_edge_name1)', $("rect." + pack_edge_name1));
    // console.log("rect." + pack_edge_name2, '$("rect." + pack_edge_name2)', $("rect." + pack_edge_name2));

    // console.log("rect." + pack_edge_name2, '$("rect." + pack_edge_name2)', $("rect." + pack_edge_name2));


    var to_pack_edge = undefined;

    $("rect." + pack_edge_name1).each(function(){
        to_pack_edge = new vis_pos(Math.floor($(this).attr("x")), Math.floor($(this).attr("y")));
        
    });
    $("rect." + pack_edge_name2).each(function(){
        to_pack_edge = new vis_pos(Math.floor($(this).attr("x")), Math.floor($(this).attr("y")));
    });

    $("rect.pack_edge").each(function(){
        if($(this).attr("id") == "router-" + String.fromCharCode(64 + vis_from)){
            from_route = new vis_pos(Math.floor($(this).attr("x")), Math.floor($(this).attr("y")));//vis_from;
            
            return;
        }
    });

    if(to_pack_edge == undefined){
        to_pack_edge = from_route;
    }
    // = new vis_pos((vis_from.x + vis_to.x) / 2, (vis_from.y + vis_to.y) / 2);
    //先移动到路由点
    vis_g.nodes[pack_name].shape.animate({'cx': from_route.x, 'cy': from_route.y, 'x': from_route.x, 'y': from_route.y}, speed);
    await sleep(speed);
    //再移动到包点
    vis_g.nodes[pack_name].shape.animate({'cx': to_pack_edge.x + offset_cood, 'cy': to_pack_edge.y + offset_cood, 'x': to_pack_edge.x + offset_cood, 'y': to_pack_edge.y + offset_cood}, speed)
}

async function pack_congested(vis_g, pack_id, speed = 500){
    var pack_name = "pack_" + pack_id;

    var cur_pack = $("#" + pack_name);

    var origin_color = cur_pack.css("fill");

    // 反复闪烁以代表被阻塞了
    for(let i = 0; i < 2; i ++ ){
        await sleep(speed);
        cur_pack.css("fill", "#000");
        await sleep(speed);
        cur_pack.css("fill", origin_color);
    }

    //再移动到包点
    //vis_g.nodes[pack_name].shape.animate({'cx': to_pack_edge.x + offset_cood, 'cy': to_pack_edge.y + offset_cood, 'x': to_pack_edge.x + offset_cood, 'y': to_pack_edge.y + offset_cood}, speed)

}

function pack_move_to_dustbin_anime(vis_g, pack_id, vis_pos_, speed = 500){
    /*
    * brief@ 数据包移动动画
    * params@ vis_g 画布
    *         pack_id  包编号
    *         cur_pos  该包的当前位置(from,to)
    *         vis_pos_ 路由位置
    *         speed    移动速度
    */
    var pack_name = "pack_" + pack_id;

    /* 为了让包不重合的太近，加了一个偏移量 */
    var offset_cood = Math.random() * 10;

    var to_pack_edge = vis_pos_;

    //再移动到包点
    vis_g.nodes[pack_name].shape.animate({'cx': to_pack_edge.x + offset_cood, 'cy': to_pack_edge.y + offset_cood, 'x': to_pack_edge.x + offset_cood, 'y': to_pack_edge.y + offset_cood}, speed)
}


function update_route_table_vis(my_graph, start, end,  init = false){

    function generateTableHead(table) {
        /* 更新表头 */
            let thead = table.createTHead();
            let row = thead.insertRow();

            let th = document.createElement("th");
            row.appendChild(th);

            my_graph.route_vertex.forEach(ele => {
                // console.log(ele, start, end)
                if(ele != start && ele != end){
                    let th = document.createElement("th");
                    //if(ele > 0){
                    let text = document.createTextNode("Router" + String.fromCharCode(65 + ele - 1));
                    th.appendChild(text);
                    //}
                    row.appendChild(th);
                }
                    


            });
        }
        function generateTable(table,  init) {
            /* 更新表内容 */
            my_graph.route_vertex.forEach(ele_i => {
                var which_router = String.fromCharCode(65 + ele_i - 1);

                if(ele_i != start && ele_i != end){
                    let row = table.insertRow();
                    /* 一行为各个路由器，到A的下一个路由入口！ */
                    let cell = row.insertCell();
                    let text = document.createTextNode(which_router);
                    cell.appendChild(text);
                    
    
                    my_graph.route_vertex.forEach(ele_j => {
                        if(ele_j != start && ele_j != end){
                            var which_entry = String.fromCharCode(65 + ele_j - 1);
    
    
                            /* 上一时刻的路由表情况 */
                            pre_elemnt = my_graph.pre_route_table[ele_j];
                            /* 逐个路由器遍历 */
                            element = my_graph.route_table[ele_j];
                            cell = row.insertCell();
        
                            var cur_content = String.fromCharCode(65 + element.route_path[ele_i] - 1);
                            var pre_content = String.fromCharCode(65 + pre_elemnt.route_path[ele_i] - 1);
                            
                            if(start == element.route_path[ele_i]){
                                cur_content = "PC1";
                            }
                            else if(end == element.route_path[ele_i]){
                                cur_content = "PC2";
                            }
                            if(start == pre_elemnt.route_path[ele_i]){
                                pre_content = "PC1";
                            }
                            else if(end == pre_elemnt.route_path[ele_i]){
                                pre_content = "PC2";
                            }

                            // 当路由表内容发生改变，修改它的颜色
                            if(pre_elemnt.route_path[ele_i] != element.route_path[ele_i] && init == false){

                                text = document.createTextNode(cur_content + "<-" + pre_content);
                                cell.appendChild(text);
                                cell.style.color = "red";
                                cell.style.backgroundColor = "#e6e6e6";
        
                                $("textarea").append("[INFO]路由表"+ which_entry + "的" + which_router +"出口从" + pre_content + "变成了" + cur_content + "！\n"); 
                            }
                            else{
                                text = document.createTextNode(cur_content);
                                cell.appendChild(text);
                            }
                        }

                    });
                }
 

 

            });
        }
        /* 找到路由表 */
        var table = document.querySelector("#router-table");
        /* 清空 */
        table.removeChild(table.childNodes[0]);

        /* 固定表大小，路由器只增不减... */
        generateTableHead(table);
        generateTable(table, init);
        
    }
function update_pack_table_vis(start, end, my_graph){
    /*
    * brief@ 更新包表
    * params@ 
    *         my_graph 核心算法结构体
    */
    function generateTableHead(table, data) {
        /* 表头 */
        let thead = table.createTHead();
        let row = thead.insertRow();
        for (let key = 0; key < data.length; key ++ ) {
            let th = document.createElement("th");

            let text = document.createTextNode(data[key]);
            th.appendChild(text);
            if(key == 0){
                let checkbox = document.createElement("INPUT");
                checkbox.setAttribute("type", "checkbox");
                checkbox.setAttribute("class", "all_pack_show")
                th.appendChild(checkbox);
            }
            
            row.appendChild(th);
        }
    }
    function generateTable(table, data) {
        for (let i = 0; i < data.length ; i ++) {
            var element = data[i];
            let row = table.insertRow();
            /* 创建复选框 */
            let show_col = row.insertCell();
            var show_box = document.createElement("INPUT");
            show_box.setAttribute("type", "checkbox");
            show_box.setAttribute("class", "show-pack_" + data[i].id + " show_certain_pack");
            show_col.appendChild(show_box);

            /* 创建包名 */
            let pack_name_col = row.insertCell();
            var pack_name = document.createTextNode(data[i].id);
            pack_name_col.appendChild(pack_name);

            /* 创建包流通路径 */
            let pack_path_col = row.insertCell();
            let path_text = "";
            for (let path = 0; path < data[i].traveled_path.length ; path ++) {
                if(path != 0){
                    path_text += " -> ";
                }
                if(start == data[i].traveled_path[path]){
                    path_text += "PC1";
                }
                else if(end == data[i].traveled_path[path]){
                    path_text += "PC2";
                }
                else
                    path_text += String.fromCharCode(65 + data[i].traveled_path[path] - 1);   
            }
            var pack_path = document.createTextNode(path_text);
            pack_path_col.appendChild(pack_path);

            /* 如果当前 图中包可见，复选框✔ */
            if($(".pack_" + data[i].id).is(":visible")){
                $('.show-pack_' + data[i].id).prop('checked', true);
            }

        }
    }

    var cur_all_pack = my_graph.achieved_pack.concat(my_graph.cur_all_pack_pos);;
    /* 找表并清空内容 */
    var pack_table_body = document.querySelector("#pack_table");
    pack_table_body.removeChild(pack_table_body.childNodes[0]);

    generateTableHead(pack_table_body, ["是否显示", "数据包id", "数据包流通路径"])
    generateTable(pack_table_body, cur_all_pack)
    
    //console.log(cur_all_pack)

    /* 当全选框被✔，所有都✔ */
    $(".all_pack_show").change(function() { 
        ////var all_certain_show = $(".show_certain_pack");
        if($(".all_pack_show").is(':checked') == true){
            $(".show_certain_pack").prop("checked", true).change();
        }
        else{
            $(".show_certain_pack").prop("checked", false).change();
        } 
    });

    /* 当某一个框被✔，对应的图被显示 */
    $(".show_certain_pack").change(function(){
        var pack_name = $(this).attr('class').split(" ")[0].split("-")[1];
        if($(this).is(":checked") == true){
            $("." + pack_name).show();
        }
        else{
            $("." + pack_name).hide();
        }
    });

    

}
