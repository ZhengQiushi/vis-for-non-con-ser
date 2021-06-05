/* �����Ϊ��֤ routeName Ϊ������*/
var config = {
    "width": 1000, // �����Ŀ�
    "height" : 600, // �����ĸ�

    "start" : "Y", // ��ò�Ҫ�޸���ʼPC��
    "end" : "Z",   // ��ò�Ҫ�޸Ľ���PC��

    "max_pack_per_edge": 4, // �ߵ�������

    "dustbin_position" : [50, 500],

    "routers":[
        {"routeName":"", "position":[0, 0]}, 
        {"routeName":"A", "position":[150, 200]}, 
        {"routeName":"B", "position":[300, 150]}, 
        {"routeName":"C", "position":[350, 400]}, 
        {"routeName":"D", "position":[500, 150]},
        {"routeName":"E", "position":[700, 300]}, 
        {"routeName":"F", "position":[800, 300]},
        {"routeName":"Y", "position" : [50, 200]}, // ��ʼPC
        {"routeName":"Z", "position" : [900, 300]} // ����PC
    ],
    "edges":[
        {"from":"A", "to":"C"},
        {"from":"A", "to":"B"},
        {"from":"C", "to":"D"},
        {"from":"B", "to":"D"},
        {"from":"C", "to":"E"},
        {"from":"D", "to":"E"},
        {"from":"E", "to":"F"},
        {"from":"Y", "to": "A"},   // ��ʼPC -> ·��
        {"from":"F", "to": "Z"}    // ·�� -> ����PC
    ]
};

