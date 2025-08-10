import React from 'react';
import { Form, Input, Select, Button, Card, message, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { createGroup, fetchGroups } from '../../store/slices/groupSlice';
import { GroupType, CreateGroupRequest } from '../../types';

const { Option } = Select;
const { TextArea } = Input;

const GroupCreate: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const { groups, loading } = useAppSelector(state => state.group);

  React.useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

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
    
    return groups.filter(group => allowedParentTypes.includes(group.type));
  };

  const handleSubmit = async (values: any) => {
    try {
      const createData: CreateGroupRequest = {
        name: values.name,
        type: values.type,
        parentId: values.parentId || undefined,
        description: values.description || undefined,
      };

      await dispatch(createGroup(createData)).unwrap();
      message.success('组织创建成功');
      navigate('/groups');
    } catch (error: any) {
      message.error(error.message || '创建失败');
    }
  };

  const handleTypeChange = (type: GroupType) => {
    form.setFieldValue('parentId', undefined);
  };

  const handleCancel = () => {
    navigate('/groups');
  };

  const selectedType = Form.useWatch('type', form);
  const parentOptions = selectedType ? getParentGroupOptions(selectedType) : [];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="创建组织" bordered={false}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ type: GroupType.HOSPITAL }}
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
              创建
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

export default GroupCreate;