/* 最好人为保证 routeName 为递增！*/
var config = {
    "width": 1000,
    "height" : 700,

    "start" : "A",
    "end" : "F",
    "max_pack_per_edge": 6,

    "routers":[
        {"routeName":"", "position":[0, 0]}, 
        {"routeName":"A", "position":[100, 200]}, 
        {"routeName":"B", "position":[300, 150]}, 
        {"routeName":"C", "position":[350, 500]}, 
        {"routeName":"D", "position":[500, 150]},
        {"routeName":"E", "position":[700, 300]}, 
        {"routeName":"F", "position":[900, 300]}
    ],
    "edges":[
        {"from":"A", "to":"C"},
        {"from":"A", "to":"B"},
        {"from":"C", "to":"D"},
        {"from":"B", "to":"D"},
        {"from":"C", "to":"E"},
        {"from":"D", "to":"E"},
        {"from":"E", "to":"F"}
    ]
};

