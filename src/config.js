/* 最好人为保证 routeName 为递增！*/
var config = {
    "width": 1000, // 画布的宽
    "height" : 600, // 画布的高

    "start" : "Y", // 最好不要修改起始PC啦
    "end" : "Z",   // 最好不要修改接受PC啦

    "max_pack_per_edge": 4, // 边的最大承载

    "dustbin_position" : [50, 500],

    "routers":[
        {"routeName":"", "position":[0, 0]}, 
        {"routeName":"A", "position":[150, 200]}, 
        {"routeName":"B", "position":[300, 150]}, 
        {"routeName":"C", "position":[350, 400]}, 
        {"routeName":"D", "position":[500, 150]},
        {"routeName":"E", "position":[700, 300]}, 
        {"routeName":"F", "position":[800, 300]},
        {"routeName":"Y", "position" : [50, 200]}, // 起始PC
        {"routeName":"Z", "position" : [900, 300]} // 接受PC
    ],
    "edges":[
        {"from":"A", "to":"C"},
        {"from":"A", "to":"B"},
        {"from":"C", "to":"D"},
        {"from":"B", "to":"D"},
        {"from":"C", "to":"E"},
        {"from":"D", "to":"E"},
        {"from":"E", "to":"F"},
        {"from":"Y", "to": "A"},   // 起始PC -> 路由
        {"from":"F", "to": "Z"}    // 路由 -> 接受PC
    ]
};

