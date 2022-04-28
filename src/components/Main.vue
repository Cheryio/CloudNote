<template>
  <div class="box">
    <el-container>
      <el-header style="height: 80px"
        ><div class="header-left">
          <i class="el-icon-cloudy"></i>
          <span>云端笔记</span>
        </div>
        <div class="header-right">
          <i class="el-icon-user" style="color: black" @click="touser"></i>
          <el-dropdown @command="quit">
            <span class="el-dropdown-link">
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div></el-header
      >
      <el-header>
        <div class="choice">
          <el-button type="primary" plain @click="dialogFormVisible_add = true"
            ><i class="el-icon-plus"></i>新增
          </el-button>
          <el-button type="info" plain @click="editnote_up"
            ><i class="el-icon-edit"></i>修改</el-button
          >
          <el-button type="danger" plain @click="delnotes_up"
            ><i class="el-icon-delete"></i>删除</el-button
          >
          <el-button type="success" plain @click="output"
            ><i class="el-icon-download"></i>导出</el-button
          >
        </div>
        <div class="search">
          <el-input v-model="searchs" placeholder="请输入标题"></el-input>
        </div>
        <div class="tubiao">
          <el-button type="primary" icon="el-icon-search" @click="search"
            >搜索</el-button
          >
          <div class="icon">
            <i
              class="el-icon-refresh-right"
              style="color: black"
              @click="refresh"
            ></i>
          </div>
        </div>
      </el-header>
      <!-- 新增模块 -->
      <el-dialog title="添加笔记" :visible.sync="dialogFormVisible_add">
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item
            label="标题"
            :label-width="formLabelWidth"
            prop="noteTitle"
          >
            <el-input v-model="form.noteTitle" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="分类"
            :label-width="formLabelWidth"
            prop="noteClass"
          >
            <el-select v-model="form.noteClass" placeholder="请选择分类">
              <el-option
                v-for="item in list"
                :key="item.cid"
                :label="item.categoryName"
                :value="item.cid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" :label-width="formLabelWidth">
            <el-checkbox v-model="form.noteCompletedState">显示</el-checkbox>
          </el-form-item>
          <el-form-item label="描述" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="form.noteDesc"></el-input>
          </el-form-item>
          <el-form-item label="内容" :label-width="formLabelWidth">
            <el-input
              type="textarea"
              v-model="form.noteContent"
              id="cnt"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible_add = false">取 消</el-button>
          <el-button
            type="primary"
            @click="(dialogFormVisible_add = false), submitForm('form')"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <el-container>
        <el-aside width="220px">
          <div class="bijifenlei">
            <div class="icon1">
              <i class="el-icon-s-opportunity" style="color: black"></i>
            </div>
            <div class="wenzi">笔记分类</div>
            <div class="icon3">
              <i
                class="el-icon-plus"
                style="color: black"
                @click="addClass"
              ></i>
            </div>
          </div>
          <div class="fenlei">
            <div>
              <ul>
                <li id="fenlei" v-for="item in list" :key="item.cid">
                  {{ item.categoryName }}
                  <i class="el-icon-delete" @click="delClass(item.cid)"></i>
                  <i
                    class="el-icon-edit"
                    @click="changeClassName(item.cid)"
                  ></i>
                </li>
              </ul>
            </div>
          </div>
        </el-aside>
        <el-main>
          <!-- 表格 -->
          <el-table
            v-loading="loading"
            ref="multipleTable"
            :data="
              tableData.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
              )
            "
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column
              label="标题"
              width="320"
              align="center"
              prop="noteTitle"
            >
            </el-table-column>
            <el-table-column
              prop="cname"
              label="分类"
              width="200"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="noteCreateTime"
              label="创建时间"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="noteCompletedState"
              label="状态"
              align="center"
              width="100"
            >
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.noteCompletedState"
                  active-color="rgb(64,158,255)"
                  inactive-color="rgb(146,147,150)"
                  @change="
                    noteStateChange(scope.row.nid, scope.row.noteCompletedState)
                  "
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" @click="editnote(scope.row.nid)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="delnote(scope.row.nid)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
      <el-footer>
        <div class="pagechange">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[4, 5, 6]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.length"
          >
          </el-pagination>
        </div>
      </el-footer>
    </el-container>
    <!-- 编辑 -->
    <el-dialog title="编辑" :visible.sync="dialogFormVisible_edit">
      <el-form :model="nowedit" :rules="rules" ref="nowedit">
        <el-form-item
          label="标题"
          :label-width="formLabelWidth"
          prop="noteTitle"
        >
          <el-input v-model="nowedit.noteTitle" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类" :label-width="formLabelWidth" prop="cname">
          <el-select
            v-model="nowedit.noteClass"
            placeholder="请选择分类"
            @change="forceSelectChange"
          >
            <el-option
              v-for="item in list"
              :key="item.cid"
              :label="item.categoryName"
              :value="item.cid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-checkbox v-model="nowedit.noteCompletedState">显示</el-checkbox>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="nowedit.description"></el-input>
        </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            v-model="nowedit.noteContent"
            id="cnt"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible_edit = false">取 消</el-button>
        <el-button type="primary" @click="update()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
import { Loading } from "element-ui";
import axios from "axios";
export default {
  data() {
    return {
      loading: false,
      nowedit: {
        noteTitle: "",
        noteClass: "",
        noteDesc: "",
        noteContent: "",
      },
      pageSize: 6,
      currentPage: 1,
      rules: {
        noteTitle: [{ required: true, message: "请输入标题", trigger: "blur" }],
        noteClass: [{ required: true, message: "请输入类名", trigger: "blur" }],
      },
      multipleSelection: [],
      searchs: "",
      list: [],
      tableData: [],
      dialogFormVisible_add: false,
      dialogFormVisible_edit: false,
      form: {
        noteTitle: "",
        noteClass: "",
        noteCompletedState: true,
        noteDesc: "",
        noteContent: "",
      },
      formLabelWidth: "120px",
    };
  },
  watch: {},
  mounted() {
    this.getclass();
    this.getnotes();
  },
  methods: {
    output() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: "warning",
          message: "请选中要导出的笔记",
        });
        return;
      }
      const { export_json_to_excel } = require("../vendor/Export2Excel.js");
      const tHeader = ["标题", "分类", "创建时间", "描述", "内容"];
      const filterVal = [
        "noteTitle",
        "cname",
        "noteCreateTime",
        "description",
        "noteContent",
      ];
      const list = this.multipleSelection;
      const data = this.formatJson(filterVal, list);
      export_json_to_excel(tHeader, data, "CloudNote");
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    editnote_up() {
      if (this.multipleSelection.length > 1) {
        this.$message({
          type: "warning",
          message: "请一次修改一篇笔记",
        });
        return;
      }
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: "warning",
          message: "请选中要修改的笔记",
        });
        return;
      }
      this.editnote(this.multipleSelection[0].nid);
    },
    delnotes_up() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: "warning",
          message: "请选中要删除的笔记",
        });
        return;
      }
      this.delnotes();
    },
    refresh() {
      this.getnotes();
    },
    noteStateChange(nid, state) {
      this.$axios({
        url: "/api/note/changeNoteCompletedState",
        method: "put",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
          nid: nid,
          changeNoteCompletedState: state,
        },
      });
    },
    //解决了视图不更新的问题
    forceSelectChange() {
      this.$forceUpdate();
    },
    update() {
      this.$confirm("是否保存您的改动?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios(
            {
              url: "/api/note/deleteNote",
              method: "delete",
              headers: {
                "Content-type": "application/x-www-form-urlencoded",
              },
              data: qs.stringify({
                nid: this.nowedit.nid,
              }),
            },
            this.$axios({
              url: "/api/note/addNote",
              method: "post",
              headers: {
                "Content-type": "application/x-www-form-urlencoded",
              },
              data: qs.stringify({
                noteTitle: this.nowedit.noteTitle,
                cid: this.nowedit.noteClass,
                noteContent: this.nowedit.noteContent,
                noteCompletedState: this.nowedit.noteCompletedState,
                description: this.nowedit.description,
              }),
            })
          ).then((res) => {
            this.dialogFormVisible_edit = false;
            this.getnotes();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消修改",
          });
        });
    },
    search() {
      this.$axios({
        url: "/api/note/getNoteByNoteTitle",
        method: "get",
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
        params: {
          noteTitle: this.searchs,
        },
      })
        .then((res) => {
          this.loading = true;
          this.searchs = "";
          let data = res.data;
          this.tableData = data.noteBeanList;
          this.tableData.forEach((item) => {
            item.noteCreateTime = item.noteCreateTime.substr(0, 10);
          });
          setTimeout(() => {
            this.loading = false;
          }, 400);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    editnote(nid) {
      this.$axios({
        url: "/api/note/getNote",
        method: "get",
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
        params: {
          nid: nid,
        },
      })
        .then((res) => {
          let data = res.data;
          if (data.success == true) {
            this.nowedit = data.noteBean;
            this.nowedit.noteClass = data.categoryBean.cid;
          }
          this.dialogFormVisible_edit = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    changeClassName(cid) {
      this.$prompt("请输入新分类名", "重命名", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\s{0,}[\S]{1,}[\s\S]{0,}/,
        inputErrorMessage: "类名不能为空！",
      })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消修改",
          });
        })
        .then(({ value }) => {
          this.$axios({
            url: "/api/category/changeCategoryName",
            method: "put",
            headers: {
              "Content-type": "application/x-www-form-urlencoded",
            },
            data: qs.stringify({
              cid: cid,
              changeCategoryName: value,
            }),
          }).then((res) => {
            let data = res.data;
            if (data.success == true) {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.getclass();
              this.getnotes();
            } else {
              this.$message.error({
                message: "修改失败",
              });
            }
          });
        });
    },
    touser() {
      this.$router.push("/User");
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getnotes() {
      this.$axios({
        url: "/api/note/getAllNote",
        method: "get",
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
      })
        .then((res) => {
          this.loading = true;
          let data = res.data;
          this.tableData = data.noteBeanList;
          this.tableData.forEach((item) => {
            item.noteCreateTime = item.noteCreateTime.substr(0, 10);
          });
          setTimeout(() => {
            this.loading = false;
          }, 400);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getclass() {
      this.$axios({
        url: "/api/user/getUser",
        method: "get",
      })
        .then((res) => {
          let data = res.data;
          this.list = data.categoryBeanList;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    quit() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    addnote() {
      this.$axios({
        url: "/api/note/addNote",
        method: "post",
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
        data: qs.stringify({
          noteTitle: this.form.noteTitle,
          cid: this.form.noteClass,
          noteContent: this.form.noteContent,
          noteCompletedState: this.form.noteCompletedState,
          description: this.form.noteDesc,
        }),
      })
        .then((res) => {
          let data = res.data;
          if (data.success == true) {
            this.$message({
              message: "添加成功",
              type: "success",
            });
            this.getnotes();
          } else {
            this.$message.error({
              message: "添加失败",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //发起新增笔记请求
          this.addnote();
          //
          this.form = {
            noteTitle: "",
            noteClass: "",
            noteCompletedState: true,
            noteDesc: "",
            noteContent: "",
          };
        } else {
          this.$message.error("添加错误");
          return false;
        }
      });
    },
    addClass() {
      this.$prompt("请输入新建分类名", "新建分类", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\s{0,}[\S]{1,}[\s\S]{0,}/,
        inputErrorMessage: "类名不能为空！",
      })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消新建分类",
          });
        })
        .then(({ value }) => {
          this.$axios({
            url: "/api/category/addCategory",
            method: "post",
            Headers: {
              "Content-type": "application/x-www-form-urlencoded",
            },
            data: qs.stringify({
              categoryName: value,
            }),
          }).then((res) => {
            let data = res.data;
            if (data.success == true) {
              this.$message({
                message: "添加成功",
                type: "success",
              });
              this.getclass();
            } else {
              this.$message.error({
                message: "添加失败",
              });
            }
          });
        });
    },
    delnotes() {
      this.$confirm("此操作将删除选中笔记, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const obj = this.multipleSelection;
        obj.forEach((item) => {
          this.$axios({
            url: "/api/note/deleteNote",
            method: "delete",
            headers: {
              "Content-type": "application/x-www-form-urlencoded",
            },
            data: qs.stringify({
              nid: item.nid,
            }),
          }).then(() => {
            this.getnotes();
            this.$message({
              type: "success",
              message: "删除成功",
            });
          });
        });
      });
    },
    delnote(nid) {
      console.log(nid);
      this.$confirm("此操作将删除该笔记, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios({
            url: "/api/note/deleteNote",
            method: "delete",
            headers: {
              "Content-type": "application/x-www-form-urlencoded",
            },
            data: qs.stringify({
              nid: nid,
            }),
          }).then((res) => {
            let data = res.data;
            if (data.success == true) {
              this.$message({
                message: "删除成功",
                type: "success",
              });
              this.getnotes();
            } else {
              this.$message.error({
                message: "删除失败",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    delClass(cid) {
      this.$confirm("此操作将删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios({
            url: "/api/category/deleteCategory",
            method: "delete",
            headers: {
              "Content-type": "application/x-www-form-urlencoded",
            },
            data: qs.stringify({
              cid: cid,
            }),
          }).then((res) => {
            let data = res.data;
            if (data.success == true) {
              this.$message({
                message: "删除成功",
                type: "success",
              });
              this.getclass();
              this.getnotes();
            } else {
              this.$message.error({
                message: "删除失败",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style lang="less" scoped>
.pagechange {
  float: right;
}
/deep/ #cnt {
  height: 525px;
}
/deep/ .el-dialog {
  width: 80%;
  height: 1000px;
  top: -12%;
}

.fenlei ul li {
  padding-left: 40px;
  height: 40px;
  text-align: left;
  line-height: 40px;
  font-size: 14px;

  .el-icon-edit {
    float: right;
    margin-top: 8%;
    margin-right: 6%;
  }
  .el-icon-delete {
    float: right;
    margin-top: 8%;
    margin-right: 6%;
  }
  .el-icon-edit:hover {
    cursor: pointer;
  }
  .el-icon-delete:hover {
    cursor: pointer;
  }
}
.bijifenlei {
  position: relative;
  height: 50px;
  background-color: rgb(247, 247, 247);
  .icon1 {
    position: absolute;
    top: 30%;
    left: 5%;
  }
  .wenzi {
    position: absolute;
    top: 30%;
    left: 30%;
  }
  .icon2 {
    position: absolute;
    top: 30%;
    right: 15%;
  }
  .icon2:hover {
    cursor: pointer;
  }
  .icon3 {
    position: absolute;
    right: 5%;
    top: 30%;
  }
  .icon3:hover {
    cursor: pointer;
  }
}
.el-header {
  position: relative;
  color: #333;
  text-align: center;
  line-height: 80px;
}
.choice {
  position: absolute;
  left: 22%;
  top: -20%;
}
.icon {
  float: right;
}
.search {
  position: absolute;
  right: 13%;
  top: -20%;
}
.tubiao {
  width: 150px;
  position: absolute;
  right: 3%;
  top: -20%;
}
.el-icon-refresh-right {
  font-size: 20px;
}
.el-icon-refresh-right:hover {
  cursor: pointer;
}
.el-aside {
  color: #333;
  text-align: center;
  height: 450px;
  border-right: 1px solid rgb(219, 218, 218);
}

.el-main {
  height: 450px;
}

.header-left {
  width: 250px;
  margin-left: -20px;
  font-size: 20px;
  float: left;
  line-height: 80px;
  background-color: rgb(48, 65, 86);
  color: white;
}
.header-right {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100px;
  float: right;
  line-height: 80px;
  color: white;
  .el-icon-arrow-down {
    font-size: 25px;
  }
  .el-icon-user {
    font-size: 30px;
  }
  .el-icon-user:hover {
    cursor: pointer;
  }
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.pagechange {
  float: right;
}
#fenlei {
  border-bottom: 1px solid rgb(229, 228, 228);
}
</style>