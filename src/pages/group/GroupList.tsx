import React, { useEffect, useState } from 'react';
import {
  Tree,
  Button,
  Input,
  Space,
  Card,
  Typography,
  Tag,
  Modal,
  message,
  Tooltip,
  Dropdown,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  TeamOutlined,
  HospitalOutlined,
  HomeOutlined,
  UserOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { DataNode, TreeProps } from 'antd/es/tree';
import type { MenuProps } from 'antd';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { 
  fetchGroupsAsync, 
  deleteGroupAsync, 
  clearError 
} from '../../store/slices/groupSlice';
import { Group, GroupType, ListGroupsRequest } from '../../types';
import { formatDateTime } from '../../utils';
import PermissionGuard from '../../components/business/PermissionGuard';

const { Search } = Input;
const { Title } = Typography;
const { confirm } = Modal;

// 组织类型映射
const groupTypeMap = {
  [GroupType.HOSPITAL]: { label: '医院', icon: <HospitalOutlined />, color: 'blue' },
  [GroupType.CAMPUS]: { label: '院区', icon: <HomeOutlined />, color: 'green' },
  [GroupType.DEPARTMENT]: { label: '科室', icon: <TeamOutlined />, color: 'orange' },
  [GroupType.TEAM]: { label: '小组', icon: <UserOutlined />, color: 'purple' },
};

interface GroupTreeNode extends DataNode {
  group: Group;
  children?: GroupTreeNode[];
}

const GroupList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { groups, loading, error } = useAppSelector(state => state.group);

  const [searchValue, setSearchValue] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  // 获取组织列表
  const fetchGroups = () => {
    const params: ListGroupsRequest = {
      page: {
        pageNum: 1,
        pageSize: 1000, // 获取所有组织数据用于树形展示
        keyword: searchValue,
      },
    };

    dispatch(fetchGroupsAsync(params));
  };

  // 初始加载
  useEffect(() => {
    fetchGroups();
  }, []);

  // 错误处理
  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // 将扁平化的组织数据转换为树形结构
  const buildGroupTree = (groups: Group[]): GroupTreeNode[] => {
    const map = new Map<string, GroupTreeNode>();
    const roots: GroupTreeNode[] = [];

    // 创建所有节点
    groups.forEach(group => {
      const typeInfo = groupTypeMap[group.type];
      const node: GroupTreeNode = {
        key: group.id,
        title: (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Space>
              {typeInfo.icon}
              <span>{group.name}</span>
              <Tag color={typeInfo.color} size="small">{typeInfo.label}</Tag>
              <Tag color={group.isEnabled ? 'green' : 'red'} size="small">
                {group.isEnabled ? '启用' : '禁用'}
              </Tag>
            </Space>
            <GroupActions group={group} />
          </div>
        ),
        group,
        children: [],
      };
      map.set(group.id, node);
    });

    // 构建树形结构
    groups.forEach(group => {
      const node = map.get(group.id)!;
      if (group.parentId && map.has(group.parentId)) {
        const parent = map.get(group.parentId)!;
        parent.children!.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  // 组织操作按钮组件
  const GroupActions: React.FC<{ group: Group }> = ({ group }) => {
    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      confirm({
        title: '删除组织',
        content: `确定要删除组织 "${group.name}" 吗？此操作将同时删除其所有子组织，且不可恢复。`,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          dispatch(deleteGroupAsync(group.id)).then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
              message.success('组织删除成功');
              fetchGroups();
            }
          });
        },
      });
    };

    const handleMenuClick = (e: React.MouseEvent, action: string) => {
      e.stopPropagation();
      switch (action) {
        case 'view':
          navigate(`/groups/${group.id}`);
          break;
        case 'edit':
          navigate(`/groups/${group.id}/edit`);
          break;
        case 'addChild':
          navigate(`/groups/create?parentId=${group.id}`);
          break;
      }
    };

    const menuItems: MenuProps['items'] = [
      {
        key: 'view',
        label: '查看详情',
        icon: <EyeOutlined />,
        onClick: (e) => handleMenuClick(e.domEvent, 'view'),
      },
      {
        key: 'edit',
        label: '编辑组织',
        icon: <EditOutlined />,
        onClick: (e) => handleMenuClick(e.domEvent, 'edit'),
      },
      {
        key: 'addChild',
        label: '添加子组织',
        icon: <PlusOutlined />,
        onClick: (e) => handleMenuClick(e.domEvent, 'addChild'),
      },
      {
        type: 'divider',
      },
      {
        key: 'delete',
        label: '删除组织',
        icon: <DeleteOutlined />,
        danger: true,
        onClick: (e) => {
          e.domEvent.stopPropagation();
          handleDelete(e.domEvent);
        },
      },
    ];

    return (
      <PermissionGuard permission="group:view">
        <Dropdown
          menu={{ items: menuItems }}
          trigger={['click']}
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            type="text"
            size="small"
            icon={<MoreOutlined />}
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      </PermissionGuard>
    );
  };

  // 搜索处理
  const onSearch = (value: string) => {
    setSearchValue(value);
    setTimeout(() => {
      fetchGroups();
    }, 300);
  };

  // 树形组件事件处理
  const onExpand: TreeProps<GroupTreeNode>['onExpand'] = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onSelect: TreeProps<GroupTreeNode>['onSelect'] = (selectedKeysValue, info) => {
    setSelectedKeys(selectedKeysValue);
    if (info.selected && info.node.group) {
      navigate(`/groups/${info.node.group.id}`);
    }
  };

  const treeData = buildGroupTree(groups);

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>组织管理</Title>
        <PermissionGuard permission="group:create">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/groups/create')}
          >
            新增组织
          </Button>
        </PermissionGuard>
      </div>

      <Card>
        {/* 搜索区域 */}
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Search
              placeholder="搜索组织名称或编码"
              allowClear
              onSearch={onSearch}
              onChange={(e) => !e.target.value && onSearch('')}
              style={{ width: 300 }}
            />
            <Button 
              icon={<ReloadOutlined />} 
              onClick={fetchGroups}
              loading={loading}
            >
              刷新
            </Button>
          </Space>
        </div>

        {/* 组织树 */}
        <div style={{ minHeight: 400 }}>
          {treeData.length > 0 ? (
            <Tree<GroupTreeNode>
              showLine={{ showLeafIcon: false }}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              selectedKeys={selectedKeys}
              onExpand={onExpand}
              onSelect={onSelect}
              treeData={treeData}
              height={600}
              style={{ fontSize: 14 }}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: 50 }}>
              <TeamOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
              <div style={{ color: '#999' }}>
                {loading ? '加载中...' : '暂无组织数据'}
              </div>
              <div style={{ marginTop: 8 }}>
                <PermissionGuard permission="group:create">
                  <Button type="primary" onClick={() => navigate('/groups/create')}>
                    创建第一个组织
                  </Button>
                </PermissionGuard>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default GroupList;