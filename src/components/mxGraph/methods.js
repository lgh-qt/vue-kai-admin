/* eslint-disable eol-last */
/* eslint-disable new-cap */
import {
  mxEvent as MxEvent
  // mxPerimeter
} from "mxgraph/javascript/mxClient";
import "./shape";
// 主要处理键盘触发事件
export default {
  methods: {
    setInitFun() {
      // 监听cell增加事件
      // this.addFun()
      this.clickCellFun();
      this.connectFun(); // 监听连线的回调
      this.setConnectValidation(); // 检验连线规则
      this.dbClickFun();
      this.labelChangeFun();
      // this.cellAddFun()
    },
    addFun() {
      this.graph.addListener(MxEvent.ADD_CELLS, (sender, evt) => {
        // const cell = evt.properties.cells[0];
        // console.log(cell);
        // this.$emit("cells_add", cell);
      });
    },
    // 生成图形
    createVerter(baseOptions) {
      const {
        x,
        y,
        width,
        height,
        styleOptions,
        value,
        options,
        to,
        id
      } = baseOptions;
      const verte = this.graph.insertVertex(this.parent, id || null, value, x, y, width, height, this.convertStyleToString(styleOptions));
      verte.to = to || [];
      verte.styleOptions = styleOptions || {};
      verte.options = options || {};
      return verte;
    },
    // labelchange
    labelChangeFun() {
      this.graph.addListener(MxEvent.LABEL_CHANGED, (sender, evt) => {
        const cell = evt.properties.cell;
        this.handleValueChange(cell);
        this.$emit("LABEL_CHANGED", cell);
      });
    },
    // // 生成线的方法
    // createEdgeFun(source, target) {
    //   const parent = this.graph.getDefaultParent();
    //   this.graph.getModel().beginUpdate();
    //   try {
    //     this.graph.insertEdge(parent, null, "", source, target);
    //   } finally {
    //     this.graph.getModel().endUpdate();
    //   }
    // },
    // 点击图形
    clickCellFun() {
      this.graph.addListener(MxEvent.CLICK, (sender, evt) => {
        this.cell = evt.getProperty("cell");
        if (!this.cell) {
          this.cell = {};
        }
        console.log(this.cell);
        this.$emit("click", this.cell);
      });
    },
    // 双击图形
    dbClickFun() {
      this.graph.addListener(MxEvent.DOUBLE_CLICK, (sender, evt) => {
        this.cell = evt.getProperty("cell");
        this.$emit("dbClick", this.cell);
      });
    },
    // 获取选中的元素
    getSelectionCells() {
      return this.graph.getSelectionCells();
    },
    // 连线方法
    connectFun() {
      this.graph.connectionHandler.addListener(
        MxEvent.CONNECT,
        (sender, evt) => {
          const edge = evt.getProperty("cell");
          const source = this.graph.getModel().getTerminal(edge, true);
          const target = this.graph.getModel().getTerminal(edge, false);
          this.handleConnect(edge, source, target);
          edge.options = {};
          this.$emit("connect", {
            edge,
            source,
            target
          });
        }
      );
    },
    cellAddFun() {
      this.graph.addListener(MxEvent.CELLS_ADDED, (sender, evt) => {
        // const cell = evt.properties.cells[0];
        // if (cell.vertex) {
        //   console.log(cell);
        //   const obj = this.getAddObj(cell);
        //   this.record(obj);
        //   console.log(this.history.snapshots);
        //   // this.$message.info('添加了一个节点');
        // } else if (cell.edge) {
        //   console.log(cell.edge);
        // }
      });
    },
    // 检验规则
    setConnectValidation() {
      this.graph.isValidConnection = (source, target) => this.rules(source, target);
    },
    // 刷新图形
    refreshCell(cell) {
      this.graph.refresh(cell);
    }
  }
};