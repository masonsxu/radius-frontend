import React from 'react';
import { Form, Input, Select, Button, Card, message, Row, Col, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateGroup, fetchGroups, fetchGroupById } from '../../store/slices/groupSlice';
import { GroupType, UpdateGroupRequest } from '../../types';

const { Option } = Select;
const { TextArea } = Input;

const GroupEdit: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const { groups, currentGroup, loading } = useAppSelector(state => state.group);
  const [initializing, setInitializing] = React.useState(true);

  React.useEffect(() => {
    const initializePage = async () => {
      if (!id) {
        message.error('缺少组织ID');
        navigate('/groups');
        return;
      }

      try {
        await Promise.all([
          dispatch(fetchGroups()).unwrap(),
          dispatch(fetchGroupById(parseInt(id))).unwrap(),
        ]);
      } catch (error: any) {
        message.error(error.message || '获取组织信息失败');
        navigate('/groups');
      } finally {
        setInitializing(false);
      }
    };

    initializePage();
  }, [dispatch, id, navigate]);

  React.useEffect(() => {
    if (currentGroup && !initializing) {
      form.setFieldsValue({
        name: currentGroup.name,
        type: currentGroup.type,
        parentId: currentGroup.parentId,
        description: currentGroup.description,
      });
    }
  }, [currentGroup, form, initializing]);

  const groupTypeOptions = [
    { value: GroupType.HOSPITAL, label: '医院' },
    { value: GroupType.CAMPUS, label: '院区' },
    { value: GroupType.DEPARTMENT, label: '科室' },
    { value: GroupType.TEAM, label: '小组' },
  ];

  const getParentGroupOptions = (selectedType: GroupType) => {
    if (selectedType === GroupType.HOSPITAL) {
      return [];
    }
    
    let allowedParentTypes: GroupType[] = [];
    switch (selectedType) {
      case GroupType.CAMPUS:
        allowedParentTypes = [GroupType.HOSPITAL];
        break;
      case GroupType.DEPARTMENT:
        allowedParentTypes = [GroupType.HOSPITAL, GroupType.CAMPUS];
        break;
      case GroupType.TEAM:
        allowedParentTypes = [GroupType.DEPARTMENT];
        break;
    }
    
    // 排除当前组织和其子组织
    return groups.filter(group => 
      allowedParentTypes.includes(group.type) && 
      group.id !== currentGroup?.id &&
      !isDescendant(group.id, currentGroup?.id || 0)
    );
  };

  // 检查是否为子组织
  const isDescendant = (groupId: number, ancestorId: number): boolean => {
    const group = groups.find(g => g.id === groupId);
    if (!group || !group.parentId) return false;
    if (group.parentId === ancestorId) return true;
    return isDescendant(group.parentId, ancestorId);
  };

  const handleSubmit = async (values: any) => {
    if (!id || !currentGroup) return;

    try {
      const updateData: UpdateGroupRequest = {
        name: values.name,
        type: values.type,
        parentId: values.parentId || undefined,
        description: values.description || undefined,
      };

      await dispatch(updateGroup({ id: parseInt(id), data: updateData })).unwrap();
      message.success('组织更新成功');
      navigate('/groups');
    } catch (error: any) {
      message.error(error.message || '更新失败');
    }
  };

  const handleTypeChange = (type: GroupType) => {
    form.setFieldValue('parentId', undefined);
  };

  const handleCancel = () => {
    navigate('/groups');
  };

  if (initializing) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!currentGroup) {
    return (
      <div style={{ padding: '24px' }}>
        <Card title="错误" bordered={false}>
          组织不存在或已被删除
        </Card>
      </div>
    );
  }

  const selectedType = Form.useWatch('type', form);
  const parentOptions = selectedType ? getParentGroupOptions(selectedType) : [];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="编辑组织" bordered={false}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="组织名称"
                name="name"
                rules={[
                  { required: true, message: '请输入组织名称' },
                  { min: 2, max: 50, message: '组织名称长度应在2-50个字符之间' },
                ]}
              >
                <Input placeholder="请输入组织名称" />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                label="组织类型"
                name="type"
                rules={[{ required: true, message: '请选择组织类型' }]}
              >
                <Select placeholder="请选择组织类型" onChange={handleTypeChange}>
                  {groupTypeOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {selectedType && selectedType !== GroupType.HOSPITAL && (
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="上级组织"
                  name="parentId"
                  rules={[{ required: true, message: '请选择上级组织' }]}
                >
                  <Select placeholder="请选择上级组织" allowClear>
                    {parentOptions.map(group => (
                      <Option key={group.id} value={group.id}>
                        {group.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          )}

          <Form.Item
            label="组织描述"
            name="description"
          >
            <TextArea
              rows={4}
              placeholder="请输入组织描述（可选）"
              maxLength={200}
              showCount
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 16 }}>
              保存
            </Button>
            <Button onClick={handleCancel}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default GroupEdit;