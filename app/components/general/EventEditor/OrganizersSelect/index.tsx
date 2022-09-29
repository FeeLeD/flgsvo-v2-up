import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useApi } from "hooks";
import { Button, MultiSelect } from "@mantine/core";
import NewOrganizationModal from "./NewOrganizationModal";

type Props = {
  organizations: number[];
  onChange: (orgsIds: number[]) => void;
};

const OrganizersSelect: FC<Props> = ({
  organizations,
  onChange = () => ({}),
}) => {
  const [chosenOrgs, setChosenOrgs] = useState<string[]>([]);
  const [isModalOpened, setModalOpened] = useState(false);
  const openModal = useCallback(() => setModalOpened(true), []);
  const closeModal = useCallback(() => setModalOpened(false), []);
  const [orgs, isLoading, getOrgs] = useApi((api) => api.event.getOrgs);
  const loadOrgs = useCallback(() => getOrgs(""), []);

  const data = useMemo(
    () =>
      orgs?.map((org) => ({
        value: org.id.toString(),
        label: org.name,
      })) ?? [],
    [orgs]
  );

  useEffect(() => {
    loadOrgs();
  }, []);

  useEffect(() => {
    if (organizations) {
      setChosenOrgs(organizations.map((o) => o.toString()));
    }
  }, [organizations]);

  const onOrgsChange = (orgsIds: string[]) => {
    setChosenOrgs(orgsIds);
    onChange(orgsIds.map((id) => parseInt(id)));
  };

  return (
    <div
      style={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "auto 220px",
        gridGap: "24px",
        alignItems: "flex-end",
      }}
    >
      <MultiSelect
        label="Организаторы"
        placeholder={isLoading ? "Загрузка..." : "Выберите организаторов"}
        searchable
        data={data}
        value={chosenOrgs}
        onChange={onOrgsChange}
      />

      <Button variant="outline" onClick={openModal}>
        Новый организатор
      </Button>

      <NewOrganizationModal
        opened={isModalOpened}
        onClose={closeModal}
        updateOrgsList={loadOrgs}
      />
    </div>
  );
};

export default OrganizersSelect;
