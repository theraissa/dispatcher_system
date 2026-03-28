import styled from "styled-components";

const Actions = styled.div`
  display: flex;
  gap: 12px;
`;

const BaseButton = styled.button`
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 8px;
  transition: 0.2s;
`;

const EditButton = styled(BaseButton)`
  background: #f2f4f7;
  color: #344054;

  &:hover {
    background: #e4e7ec;
  }
`;

const DeleteButton = styled(BaseButton)`
  background: #fff1f0;
  color: #d92d20;

  &:hover {
    background: #fee4e2;
  }
`;

type Props = {
  onEdit: () => void;
  onDelete: () => void;
};

export default function ServiceActionButtons({ onEdit, onDelete }: Props) {
  return (
    <Actions>
      <EditButton onClick={onEdit}>
        Editar
      </EditButton>

      <DeleteButton onClick={onDelete}>
        Excluir
      </DeleteButton>
    </Actions>
  );
}
