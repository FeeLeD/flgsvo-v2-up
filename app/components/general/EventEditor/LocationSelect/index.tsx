import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useApi } from "hooks";
import { Button, Select } from "@mantine/core";
import NewLocationModal from "./NewLocationModal";

type Props = {
  locationId?: number;
  onChange?: (locationId: number) => void;
};

const LocationSelect: FC<Props> = ({ locationId, onChange = () => ({}) }) => {
  const [location, setLocation] = useState<number>();
  const [isModalOpened, setModalOpened] = useState(false);
  const openModal = useCallback(() => setModalOpened(true), []);
  const closeModal = useCallback(() => setModalOpened(false), []);
  const [locations, isLoading, getLocations] = useApi(
    (api) => api.event.getLocations
  );
  const loadLocations = useCallback(() => getLocations(""), []);

  const data = useMemo(
    () =>
      locations?.map((location) => ({
        value: location.id.toString(),
        label: location.name,
      })) ?? [],
    [locations]
  );

  useEffect(() => {
    loadLocations();
  }, []);

  useEffect(() => {
    if (locationId) {
      const chosen = data.find(
        (location) => location.value === locationId?.toString()
      );

      setLocation(chosen?.value ? parseInt(chosen.value) : undefined);
    }
  }, [locationId, data]);

  const onLocationChange = (locationId: string) => {
    setLocation(parseInt(locationId));
    onChange(parseInt(locationId));
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
      <Select
        label="Место проведения"
        placeholder={
          isLoading ? "Загрузка..." : "Выберите место проведения события"
        }
        searchable
        required
        nothingFound="Ничего не найдено"
        data={data}
        value={location?.toString()}
        onChange={onLocationChange}
      />

      <Button variant="outline" onClick={openModal}>
        Новое место проведения
      </Button>

      <NewLocationModal
        opened={isModalOpened}
        onClose={closeModal}
        updateLocationsList={loadLocations}
      />
    </div>
  );
};

export default LocationSelect;
