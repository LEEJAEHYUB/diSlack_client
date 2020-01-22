import React from "react";
import axios from "axios";
import { Menu, Icon, Modal, Button } from "antd";
import PlusDM from "./PlusDM";
import PlusChannel from "./PlusChannel";
import SiderETC from "./SiderETC";
import "antd/dist/antd.css";
import "./Sider.css";

class Side extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: "1",
      visibleCN: false,
      visibleDM: false,
      newNameCN: "",
      newNameDM: "",
    };
    this.handleOkCN = this.handleOkCN.bind(this);
    this.handleStateCN = this.handleStateCN.bind(this);
  }

  // lifeCycle
  componentDidMount() {}

  // 채널명을 적어서 서버에 보내자
  handleStateCN = item => {
    this.setState(() => {
      this.setState({ newNameCN: item });
    });
  };

  // 모달 메소드 (showModal, handleOk, handleCancel)
  showModalCN = () => {
    this.setState({
      visibleCN: true,
    });
  };

  showModalDM = () => {
    this.setState({
      visibleDM: true,
    });
  };

  // 채널생성 OK
  handleOkCN = e => {
    this.setState({
      visibleCN: false,
    });
    // console.log("채널생성이름", this.state.newNameCN);
    const newCN = {
      name: this.state.newNameCN,
    };
    axios
      .post(
        `${process.env.REACT_APP_DEV_URL}/${this.props.currentWorkspace[0].code}/channel/create`,
        newCN,
        {
          withCredentials: true, // 쿠키전달
        },
      )
      .then(res => {
        console.log("채널생성보냄!", res);
        this.props.setChannelDM("channel", res.data);
      })
      .catch(err => {
        console.log(err);
        if (err.response.status === 419) {
          localStorage.setItem("isLogin", null);
          this.setState({ isLogin: false });
          alert("다시 로그인 해주세요");
          window.location = "/signin";
        }
      });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visibleCN: false,
      visibleDM: false,
    });
  };

  handleClick = e => {
    this.setState({
      current: e.key,
    });
  };

  render() {
    // console.log("SIDER_PROPS", this.props);
    const {
      channels,
      dms,
      clickedChannel,
      clickedDM,
      currentWorkspace,
      userInfo,
      setChannelDM,
    } = this.props;
    const { current } = this.state;

    return (
      <div style={{ height: "100%" }}>
        <Menu
          className="Sider-Menu"
          onClick={this.handleClick}
          style={{}}
          defaultOpenKeys={["sub1"]}
          selectedKeys={[current]}
          mode="inline"
        >
          <div
            className="Sider-Title"
            style={{ marginTop: "20%", marginBottom: "20%" }}
          >
            <Icon
              type="message"
              style={{ fontSize: "16px", marginLeft: "3%", marginRight: "3%" }}
              onClick={e => {
                this.showModalCN(e);
              }}
            />
            Thread{" "}
          </div>
          <div
            className="Sider-Title"
            style={{ marginTop: "5%", marginLeft: "3%", marginBottom: "7%" }}
          >
            Channel{" "}
            <Icon
              className="Sider-icon-plus"
              type="plus-circle"
              style={{ fontSize: "15px", marginLeft: "3%" }}
              onClick={e => {
                this.showModalCN(e);
              }}
            />
          </div>
          {channels.map((item, i) => (
            <Menu.Item
              className="Sider-item"
              key={i}
              style={{
                backgroundColor: "#400d3f",
                color: "#ecf0f1",
                margin: "0",
                height: "30px",
              }}
              onClick={e => {
                clickedChannel(item.id);
              }}
            >
              <Icon type="container" style={{ marginRight: "3%" }} />
              {item.name}
            </Menu.Item>
          ))}
          <div
            className="Sider-Title"
            style={{ marginTop: "10%", marginBottom: "7%", marginLeft: "3%" }}
          >
            Dm{" "}
            <Icon
              className="Sider-icon-plus"
              type="plus-circle"
              style={{ marginLeft: "3%", fontSize: "15px" }}
              onClick={e => {
                this.showModalDM(e);
              }}
            />
          </div>

          {dms.map((item, i) => (
            // console.log("DM_들!", item);
            <Menu.Item
              className="Sider-item"
              key={i}
              style={{
                backgroundColor: "#400d3f",
                color: "#ecf0f1",
                margin: "0",
                height: "30px",
              }}
              onClick={e => {
                clickedDM(item.id);
              }}
            >
              <Icon type="message" style={{ marginRight: "3%" }} />
              {item.users[1].name}
            </Menu.Item>
          ))}
          <SiderETC />
        </Menu>
        {/* 채널생성 모달 */}
        <Modal
          title="Create Channel"
          visible={this.state.visibleCN}
          onOk={() => {
            this.handleOkCN();
          }}
          onCancel={() => {
            this.handleCancel();
          }}
        >
          <PlusChannel
            handleOkCN={this.handleOkCN}
            handleState={this.handleStateCN}
          />
        </Modal>
        {/* DM 생성 모달 */}
        <Modal
          title="Create DM"
          visible={this.state.visibleDM}
          onOk={() => {
            this.handleOkDM();
          }}
          onCancel={() => {
            this.handleCancel();
          }}
        >
          <PlusDM
            handleOkDM={this.handleOkDM}
            handleState={this.handleStateDM}
            currentWorkspace={currentWorkspace}
            userInfo={userInfo}
            setChannelDM={setChannelDM}
          />
        </Modal>
      </div>
    );
  }
}
export default Side;
