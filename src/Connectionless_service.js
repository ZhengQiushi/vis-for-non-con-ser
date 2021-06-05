    /* 边类 定义边的到达方和边权 */
    /* 边权初始设置为1 代表该边无数据包经过 */
    /* 若有数据包经过 则边权+1 */


    function ArcEdge(to, weight)
    {
        /* 成员变量 
            to: 到达的另外一个顶点信息
            weight: 当前边边权
        */
        this.to = to;
        this.weight = weight;

        /* 函数声明：修改该边的到达点 
            tmp_to: 到达的另外一个顶点信息
        */
        this.set_to = function(tmp_to){
            this.to = tmp_to;
        }

        /* 函数声明：修改该边的权重
            tmp_weight: 权重值
        */
        this.set_weight = function(tmp_weight){
            this.weight = tmp_weight;
        }

        /* 函数声明：获取该边的到达点
            返回值：该边的到达点
        */
        this.get_to = function(){
            return this.to;
        }

        /* 函数声明：获取该边的权重
            返回值：该边的权值
        */
        this.get_weight = function(){
            return this.weight;
        }
    }

    /* 路由表类 */
    
    var cur_vertex_node_num = 6;
    

    function RouteTable(route_id, max_vertex_node)
    {
        /* 成员变量
            route_id: 路由表的id
            route_path: 路由表的路径
        */
        this.route_id = String.fromCharCode(65 + route_id - 1)
        this.route_path = [];
        this.removed = true;
        
        /* 函数声明：初始化路由数组 
        */
        this.init = function(){
            for(var i = 0; i < max_vertex_node; i++)
                this.route_path.push(0);
        }


        this.set_route = function(route_vertex, path_value){
            /* 函数声明：修改某点路由信息 
                route_vertex: 要修改路由的点
                path_value:所设置的路由路径
            */
            this.route_path[route_vertex] = path_value;
        }


        this.get_route = function(des_vertex){
            /* 函数声明：查询某点路由信息 
                des_vertex: 所要到达的路由点
            */
            return this.route_path[des_vertex];
        }
    }

    /* 数据包位置类 */
    /* 设定数据包从起点移动到终点 */
    var global_pack_id = 0;

    function find_id_pack(id, pack_set){
        for(let i = 0 ; i < pack_set.length; i ++ ){
            if(id == pack_set[i].id){
                return pack_set[i];
            }
        }
        return [-1, -1, -1]
    }

    function Packet_Pos(edge1, edge2)
    {
        /* 成员变量
            edge 1-2: 该数据包位于哪两条边之间? 路由之间？
            traveled_path: 经过的路径
        */
        this.edge1 = edge1;
        this.edge2 = edge2;
        this.from = 0;
        this.to = 0;

        this.id = global_pack_id ++ ;
        this.traveled_path = [];

        /* 函数声明：获取数据包的边位置
            返回值: 边位置数组[]
        */
        this.get_pos = function(){             
            /* 保证返回的edge1 小于 edge2 e.vis_g. [1-2]*/ 
            return [this.edge1, this.edge2];

            if(this.edge1 < this.edge2)
                return [this.edge1, this.edge2]
            return [this.edge2, this.edge1]
        }
        this.lets_go = function(){             
            return [this.from, this.to]
        }
        /* 函数声明：设置数据包的边位置
        */
        this.set_pos = function(edge1, edge2){
            this.edge1 = edge1
            this.edge2 = edge2            
        }

        this.get_traveled = function(){
            this.traveled_path.push(this.get_pos()[0]);//
            // this.from = this.to;
            // this.to = this.get_pos()[0];
        }
    }

    function hardCopy (obj) {
        var newobj = obj.constructor === Array ? [] : {};
        if(typeof obj !== 'object'){
            return;
        }
        for(var i in obj){
           newobj[i] = typeof obj[i] === 'object' ? hardCopy(obj[i]) : obj[i];
        }
        return newobj
    }

    /* 路由器的无环图 */
    function myGraph(router_name, edges_, start, terminal, max_data_packet_cnt)
    {
        /* 
        参数：
            router_name：数字，A->1
            edges_：.from .to
        成员变量
            start: 起始顶点
            terminal: 终点
            limit_packet: 每条传送线上所能有的数据包上限
            route_vertex: 路由顶点
            route_table: 路由表
            route_edge: 路由边
            least_pos: 维护单源最短路径数组
            packet_pos: 数据包位置
            init_packet_cnt: 在初始位置会被传送的数据包
        */
        this.start = start
        this.terminal = terminal
        this.limit_packet = max_data_packet_cnt + 1;
        this.route_vertex = []; // 目的地？

        this.route_table = [];
        this.pre_route_table = []; // 上一时刻的路由表情况

        this.congestion_packets = [];

        this.route_edge = []; // route_edge[index][....] 下标的index的路由伸出去的点
        this.least_pos = []; // least[to] = from  -> 记录目标点的起源点
        this.packet_pos = []; // 所有当前仍然在流动的数据包
        this.init_packet_cnt = 0;
        this.new_pack_gen = []; // 每轮新增的包
        this.achieved_pack = [];  //每轮到达目标地址

        this.died_pack = []; // 死了

        this.max_vertex_node = 0;

        router_name.forEach(ele => {
            if(this.max_vertex_node < ele){
                this.max_vertex_node = ele;
            }
        })

        this.cur_edges = []; // 每个都是[1, 2] 1 < 2
        /* 函数声明：初始化图结构
        */
        this.init = function(){
            for(var i = 0; i <= this.max_vertex_node; i++){
                this.least_pos.push(0);
                // 初始化
                this.route_table.push(new RouteTable(i, this.max_vertex_node))
                this.route_table[this.route_table.length - 1].init();
                // 某一个路由的所有边？
                this.route_edge.push([]);
            }
            router_name.forEach(element => {
                if(element != 0){
                    this.route_vertex.push(element);
                    // console.log(this.max_vertex_node)
                    // console.log(this.route_table[element])
                    this.route_table[element].removed = false;
                }
            });
            // for(var i = 1; i <= cur_vertex_node_num; i++){
            //     this.route_vertex.push(i);
            // }
            /*
             * A -> 1
             * B -> 2
             * C -> 3
             * D -> 4
             * E -> 5
             * F -> 6
             */
            var default_weight = 1;
            edges_.forEach(ele => {
                //console.log(ele);
                this.route_edge[ele.from].push(new ArcEdge(ele.to, default_weight));
                this.route_edge[ele.to].push(new ArcEdge(ele.from, default_weight));
                this.cur_edges.push([ele.from,ele.to]);
                
            })
        }


        this.find_entry = function(des_vertex, front_vertex)
        {
            /* 函数声明：根据pos数组最短路径的信息以及des_vertex 找到front_vertex到des_vertex的出口点
                找出口路由！
                des_vertex: 目的地路由信息
                front_vertex: 起点路由信息
                返回值: 起点路由信息的出口，若起点位置和终点位置相同 则置-1 若无法找到 则置-1
            */
            if(des_vertex == front_vertex || this.least_pos[des_vertex] == -1)
                return -1
            var tmp = des_vertex;

            // 从目标点倒过来找，下一个位置
            while(this.least_pos[tmp] != front_vertex){// visit[tmp] == 0){
                tmp = this.least_pos[tmp];
            }
            
            return parseInt(tmp, 10)
        }


        
        this.data_packet_move = function(new_send_pack_num)
        {
            /* 函数声明：图中数据包移动
                数据包移动结束后会修改边权
            */

            /* 首先对图中存在的包进行移动（即位置不在原点！） */
            for(var i = 0; i < this.packet_pos.length; i++){
                
                var arr = this.packet_pos[i].get_pos() // arr[from，to]
                
                console.log("data_packet_move: ", arr[0], arr[1]);

                /* 无效的数据包，位置在原点！ */
                if(arr[0] == 0 && arr[1] == 0){
                    continue;
                }
                    
                
                /*
                 * 原来的权重被去除！
                 */
                // 正向边
                for(var j = 0; j < this.route_edge[arr[0]].length; j++)
                    // 遍历所有从路由[from] 出去的边
                    if(this.route_edge[arr[0]][j].get_to() == arr[1])
                    // 正好在这个路由的边上！
                        this.route_edge[arr[0]][j].set_weight(this.route_edge[arr[0]][j].get_weight() - 1)
                
                // 反向边
                for(var j = 0; j < this.route_edge[arr[1]].length; j++)
                    if(this.route_edge[arr[1]][j].get_to() == arr[0])
                        this.route_edge[arr[1]][j].set_weight(this.route_edge[arr[1]][j].get_weight() - 1)
                

                /* 该包已到达终点 */
                if(arr[0] == this.terminal || arr[1] == this.terminal){
                    this.packet_pos[i].set_pos(0, 0)
                    //
                    this.packet_pos[i].traveled_path.push(this.terminal);
                    this.achieved_pack.push(this.packet_pos[i]);
                    
                    continue;
                }
                
                /* 使用tmp_arr 记录原位置 */
                var tmp_arr = [arr[0], arr[1]];
                /* 此时的arr数组中的数据为数据包的新位置*/
                arr = [arr[1], this.route_table[arr[1]].get_route(this.terminal)]
                console.log("arr : ", arr);
                if(arr[1] == -1){
                    // 包无法到达  认为直接死掉
                    this.packet_pos[i].set_pos(0, 0);
                    this.died_pack.push(i); // 死了
                    console.log("死了！",  this.packet_pos[i])
                    continue
                }
                else if(arr[0] == tmp_arr[0] && arr[1] == tmp_arr[1]){
                    // 反向传递
                    arr = [arr[0], this.route_table[arr[0]].get_route(this.terminal)]
                }

                /* 更新包移动后的边权 */
                /*
                 * 新增边权
                 */
                for(var j = 0; j < this.route_edge[arr[0]].length; j++){
                    if(this.route_edge[arr[0]][j].get_to() == arr[1]){
                        if(this.route_edge[arr[0]][j].get_weight() == this.limit_packet){  // 包阻塞 被滞留  //防止级联阻塞
                            this.congestion_packets.push(this.packet_pos[i]);

                            for(var k = 0; k < this.route_edge[tmp_arr[0]].length; k++){
                                if(this.route_edge[tmp_arr[0]][k].get_to() == tmp_arr[1])
                                    this.route_edge[tmp_arr[0]][k].set_weight(this.route_edge[tmp_arr[0]][k].get_weight() + 1)
                            }
                        }
                        else{
                            console.log(this.packet_pos[i].id, ": ", arr[0], "-> ", arr[1], "阻塞啦！" );


                            this.route_edge[arr[0]][j].set_weight(this.route_edge[arr[0]][j].get_weight() + 1)
                            /* 更新包的位置 */
                            this.packet_pos[i].set_pos(arr[0], arr[1])
                            this.packet_pos[i].get_traveled();
                        }
                    }
                }

                for(var j = 0; j < this.route_edge[arr[1]].length; j++){
                    if(this.route_edge[arr[1]][j].get_to() == arr[0]){
                        if(this.route_edge[arr[1]][j].get_weight() == this.limit_packet){  // 包阻塞 被滞留  //防止级联阻塞
                            
                        
                            for(var k = 0; k < this.route_edge[tmp_arr[1]].length; k++){
                                if(this.route_edge[tmp_arr[1]][k].get_to() == tmp_arr[0])
                                    this.route_edge[tmp_arr[1]][k].set_weight(this.route_edge[tmp_arr[1]][k].get_weight() + 1)
                            }
                        }
                        else
                            this.route_edge[arr[1]][j].set_weight(this.route_edge[arr[1]][j].get_weight() + 1)
                    }
                } 
            }
            this.init_packet_cnt += new_send_pack_num
            /* 然后对起点的数据包进行处理 */
            while(this.init_packet_cnt > 0){
                var arr = [this.start, 0]
                arr[1] = this.route_table[this.start].get_route(this.terminal);


                var cur_new_pack = new Packet_Pos(this.start, arr[1]);
                

                var can_achieve = false;
                var is_congested = true;

                for(var i = 0; i < this.route_edge[this.start].length; i++){
                    if(this.route_edge[arr[0]][i].get_to() == arr[1]){
                        // 满足前进方向!
                        can_achieve = true;
                        if(this.route_edge[arr[0]][i].get_weight() != this.limit_packet){
                            //没有阻塞,更新边权,直接走
                            this.route_edge[arr[0]][i].set_weight(this.route_edge[arr[0]][i].get_weight() + 1)
                            for(var j = 0; j < this.route_edge[arr[1]].length; j++){
                                if(this.route_edge[arr[1]][j].get_to() == arr[0]){
                                    this.route_edge[arr[1]][j].set_weight(this.route_edge[arr[1]][j].get_weight() + 1)
                                }
                            }
                            cur_new_pack.get_traveled();
                            is_congested = false;
                            break;
                        }
                        else{
                            //阻塞了
                        }
                    }

                }
                this.new_pack_gen.push(cur_new_pack.id);
                this.packet_pos.push(cur_new_pack);

                if(can_achieve == false){
                    // 没有可以前进的方向,说明死了已经
                    cur_new_pack.set_pos(0, 0);
                    this.died_pack.push(cur_new_pack.id); // 死了
                    console.log("死了！",  cur_new_pack)
                }
                else{
                    if(is_congested == true){   
                        //说明阻塞住了
                        cur_new_pack.edge1 = cur_new_pack.edge2 = start;
                        var congest_pack = hardCopy(cur_new_pack);
                        // 打印阻塞的方向
                        console.log("congest_pack: ", congest_pack);
                        congest_pack.edge2 = this.route_table[this.start].get_route(this.terminal);//this.route_table[1].get_route(6); // 
                        this.congestion_packets.push(congest_pack);
                    }
                }
                this.init_packet_cnt -= 1
            }
            
            /* 更新路由表 */
            this.update_route_table()
        }
    
        /* 函数声明：获取所有数据包信息
            返回值：所有有效的数据包位置
        */
       this.cur_all_pack_pos = [];
       this.prev_all_pack_pos = [];

        this.get_data_packet = function(){
            var res = []
            for(var i = 0; i < this.packet_pos.length; i++){
                var arr = this.packet_pos[i].get_pos()
                if(arr[0] != 0 && arr[1] != 0)
                    res.push(this.packet_pos[i])
            }
            return res
        }


        this.update_least_pos = function(start){
            /* 函数声明：获取某个顶点到其余顶点的最短路径，
                    ！！！！！更新least_pos数组！！！！！
                使用带权的dij算法对路由表进行更新，对所有顶点使用dij算法
                返回值：返回start到终点的最短距离
            */
            var visit = []
            var dis = []

            for(var i = 0; i <= this.max_vertex_node; i++){
                visit.push(0)
                dis.push(100000)
                this.least_pos[i] = -1 // 表示无法找到最短路径
            }
            var queue = []
            queue.push([start, 0]) // ? [start, 0] -> [要去的点，距原点的距离]
            dis[start] = 0

            while(queue.length > 0){
                var tmp = queue[0] // 队首元素
                var tmp_pos = 0
                for(var i = 0; i < queue.length; i++){ 
                    if(queue[i][1] < tmp[1]){ // 选距离最近且未遍历过的点!
                        tmp = queue[i]
                        tmp_pos = i
                    }
                }
                queue.splice(tmp_pos, 1) // 删除tmp_pos位置的
                if(visit[tmp[0]] == 1)  // 已经遍历过该点
                    continue;
                visit[tmp[0]] = 1 

                for(var i = 0; i < this.route_edge[tmp[0]].length; i++){
                    // 更新这个点的周边情况，更新距离
                    if(dis[tmp[0]] + this.route_edge[tmp[0]][i].get_weight() < dis[this.route_edge[tmp[0]][i].get_to()]){
                        // 边的长度
                        dis[this.route_edge[tmp[0]][i].get_to()] = dis[tmp[0]] + this.route_edge[tmp[0]][i].get_weight()

                        //! 动了全局变量！ nmd
                        this.least_pos[this.route_edge[tmp[0]][i].get_to()] = tmp[0] 

                        queue.push([this.route_edge[tmp[0]][i].get_to(), dis[this.route_edge[tmp[0]][i].get_to()]])
                    }
                }
            }
            return dis[this.terminal]
        }


        this.update_route_table = function(){
            /* 函数声明：路由表更新
                对所有顶点使用dij算法进行路由调整
            */
            this.pre_route_table = hardCopy(this.route_table);
           /* !!! reset!!! */
            for(var i = 0; i <= 6; i++){
                for(var j = 0; j <= 6; j++){
                    this.route_table[i].set_route(j, -1);
                }
            }

            for(var i = 0; i < this.route_vertex.length; i++){
                var vertex_index = this.route_vertex[i]
                /* 获取least_pos 数组 */
                this.update_least_pos(vertex_index) //! 使用dji 更新了点和点之间的情况

                for(var j = 0; j < this.route_vertex.length; j++){

                    var dst_index = this.route_vertex[j]
                    //更新每个点的出口路由
                    this.route_table[vertex_index].set_route(dst_index, this.find_entry(dst_index, vertex_index))
                }
            }
        }

        /* 函数声明：展示出所有拥塞边的信息
            获取拥塞边数组 [front，to] 不会出现边的重复
        */
        this.show_congestion = function(){
            var res = []
            var visit = []
            /* 初始化visit数组 */
            for(var i = 0; i <= this.route_vertex.length; i++){
                visit.push([])
                for(var j = 0; j <= this.route_vertex.length; j++){
                    visit[visit.length-1].push([])
                }
            }
            for(var i = 0; i < route_vertex.length; i++){
                var vertex_index = route_vertex[i]
                for(var j = 0; j <= this.route_edge[vertex_index].length; j++){
                    var arr = [vertex_index, this.route_edge[vertex_index][j].get_to()]
                    if(visit[arr[0]] == 1 && visit[arr[1]] == 1)
                        continue;
                    res.push([arr[0], arr[1]])
                    visit[arr[0]] = 1
                    visit[arr[1]] == 1
                }
            }
            return res
        }
    
        /* 函数声明：删除顶点
            改变图的拓扑结构并更新路由
        */
        this.remove_vertex = function(vertex_index){
            /* 若顶点不存在 拒绝删除*/
            var find_ = 0
            for(var i = 0; i < this.route_vertex.length; i++)
                if(this.route_vertex[i] == vertex_index)
                    find_ = 1
            if(find_ == 0){
                //顶点不存在  拒绝删除
                alert("该顶点不存在，拒绝删除")
                    return false;
            }
            if(vertex_index == this.start || vertex_index == this.terminal){
                alert("删除的顶点为路由起点或路由终点，拒绝删除")
                return false;
            }
            /* 若与顶点相连的边有数据包 拒绝删除*/
            /* 边上有数据包的判定条件可以通过边权来判定 */
            for(var i = 0; i < this.route_edge[vertex_index].length; i++){
                if(this.route_edge[vertex_index][i].get_weight() > 1){
                    //有数据包  拒绝删除
                    alert("该顶点所连接边包含数据包，拒绝删除")
                    return false;
                }
            }
            var pos
            for(var i = 0; i < this.route_vertex.length; i++)
                if(this.route_vertex[i] == vertex_index)
                   pos = i

            /* 删除顶点 */
            this.route_vertex.splice(pos, 1)

            /* 删除对应连接边 */
            while(this.route_edge[vertex_index].length > 0){
                // 更新了删除的方法
                var cur_edge = this.route_edge[vertex_index][0];
                this.remove_edge(vertex_index, cur_edge.get_to());
            }

   
            this.route_table[vertex_index].removed = true;

            /* 更新对应路由表 */
            this.update_route_table();

            return true;
        }
    
        /* 函数声明：删除边
            改变图的拓扑结构并更新路由
        */
        this.remove_edge = function(from, to){
            /* 检测该边是否有数据包 同样通过边权确定 */
            var flag = 0 //确定是否存在该边
            var pos
            for(var i = 0; i < this.route_edge[from].length; i++){
                if(to == this.route_edge[from][i].get_to() && this.route_edge[from][i].get_weight() == 1){
                    flag = 1
                    pos = i
                }
            }
            if(flag == 0){
                alert("不存在该边 或该边存在数据包 拒绝删除")
                return false;
            }
            else
                this.route_edge[from].splice(pos, 1)
            
            for(var i = 0; i < this.route_edge[to].length; i++){
                if(from == this.route_edge[to][i].get_to()){
                    pos = i
                }
            }

            this.route_edge[to].splice(pos, 1)
            /* 更新对应路由表 */
            this.update_route_table()

            /* 更新当前边集 */
            if(from > to)
                [from, to] = [to, from];
            console.log("!!!!!!")
            console.log(this.cur_edges)
            for(let i = 0 ; i < this.cur_edges.length; i ++ ){
                var cur_edge = this.cur_edges[i];
                console.log(cur_edge)
                if(cur_edge[0] == from && cur_edge[1] == to){
                    console.log("!!!!!!")
                    this.cur_edges.splice(i, 1);
                    break;
                }
                    
            }
            return true;
        }   
    
        /* 函数声明：增加边
            改变图的拓扑结构并更新路由
        */
        this.add_edge = function(from, to){
            /* 首先对from to两个顶点进行检测 查看是否有新顶点 */
            var visit = []
            for(var i = 0; i <= this.max_vertex_node; i++)
                visit.push(0)
            for(var i = 0; i < this.route_vertex.length; i++)
                visit[this.route_vertex[i]] = 1

            if(visit[from] == visit[to] && visit[from] == 1){
                for(var i = 0; i < this.route_edge[from].length; i++){
                    if(this.route_edge[from][i].get_to() == to){
                        alert("该边已存在 拒绝添加")
                        return -1;
                    }
                }
            }

            if(visit[from] == 0)
                this.route_vertex.push(from)
            if(visit[to] == 0)
                this.route_vertex.push(to)
            

            this.route_edge[from].push(new ArcEdge(to, 1));
            this.route_edge[to].push(new ArcEdge(from, 1));

            if(from > to)
                this.cur_edges.push([to, from]);
            else{
                this.cur_edges.push([from, to]);
            }

            /* 更新对应路由表 */
            this.update_route_table();

            return 1;
        }
    
        /* 函数声明：展示出每个顶点的路由表信息
            返回值：每个顶点的路由表信息
        */
        this.get_route_table = function(){
            return this.route_table
        }
    }

    
