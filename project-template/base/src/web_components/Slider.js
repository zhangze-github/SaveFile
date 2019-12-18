import React , {Component} from 'react';
import { Menu, Icon } from 'antd';
import { BrowserRouter as Router, Route, Link, NavLink, HashRouter} from "react-router-dom";

const { SubMenu } = Menu;
import {} from 'actions/http';


const menus = {
    "menus": [
        {
            "menuDisplayOrder": 1,
            "menuCode": "helper.function",
            "name": "Demo",
            "menuId": "051f735e947f4ac18b4df581dc0299af",
            "isLeaf": 0,
            "parentId": "67c74272b18a4254b7bc1f010a15f14e",
            "productType": "fraud",
            "url": "/test"
        },
        {
            "menuDisplayOrder": 1,
            "menuCode": "helper.function",
            "name": "one",
            "menuId": "051f735e947f4ac184df581dc0299af",
            "isLeaf": 1,
            "parentId": "051f735e947f4ac18b4df581dc0299af",
            "productType": "fraud",
            "url": "/test/one"
        },
        {
            "menuDisplayOrder": 1,
            "menuCode": "helper.function",
            "name": "two",
            "menuId": "051f735e947f4ac18b4d581dc0299af",
            "isLeaf": 1,
            "parentId": "051f735e947f4ac18b4df581dc0299af",
            "productType": "fraud",
            "url": "/test/three"
        },
        {
            "menuDisplayOrder": 1,
            "menuCode": "helper.function",
            "name": "three",
            "menuId": "051f735e947f4acb4d581dc0299af",
            "isLeaf": 1,
            "parentId": "051f735e947f4ac18b4df581dc0299af",
            "productType": "fraud",
            "url": "/test/two"
        },
        {
            "menuDisplayOrder": 1,
            "menuCode": "helper.function",
            "name": "测试2",
            "menuId": "051f735e94f4ac18b4df581dc0299af",
            "isLeaf": 0,
            "parentId": "67c74272b18a4254b7bc1f010a15f14e",
            "productType": "fraud",
            "url": "/helper"
        }
    ]
}

export default class Sider extends React.Component {
  handleClick = e => {
    // console.log('click ', e);
  };

  render() {
    return (
      <Menu
        // onClick={this.handleClick}
        style={{ width: 180 , height: '100%', position: 'fixed', paddingTop: 45}}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        // theme='dark'
      >
          {
              menus.menus.map((menu1, index1)=>{
                  if(menu1.isLeaf === 0)
                  return(
                    <SubMenu
                        key={index1}
                        title={
                        <span>
                            <Icon type="setting" />
                            <span>{menu1.name}</span>
                        </span>
                        }
                    >
                        {
                            menus.menus.map((menu2,index2)=> {
                                if(menu1.menuId === menu2.parentId){
                                    return(
                                        <Menu.Item key={index2}>
                                            <NavLink to={menu2.url} key={index2}>
                                                {menu2.name}

                                            </NavLink>
                                        </Menu.Item>
                                    )
                                }
                            })
                        }
                    </SubMenu>
                  )
            
              })
          }
      </Menu>
    );
  }
}
