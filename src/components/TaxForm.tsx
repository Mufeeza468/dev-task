import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { itemsData } from "../data/items";
import { numberToText, textToNumber } from "../utils/taxHelpers";

import CheckIcon from "@mui/icons-material/Check";

const CustomIcon = (
  <Box
    sx={{
      width: 20,
      height: 20,
      borderRadius: "50%",
      border: "1px solid gray",
    }}
  />
);

const CustomCheckedIcon = (
  <Box
    sx={{
      width: 22,
      height: 22,
      borderRadius: "50%",
      backgroundColor: "orange",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <CheckIcon sx={{ fontSize: 18, color: "white" }} />
  </Box>
);

const TaxForm: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [categories, setCategories] = useState<any>({});
  const [noCategoryChecked, setNoCategoryChecked] = useState<boolean>(false);

  useEffect(() => {
    const categoryMap: { [key: string]: number[] } = {};
    itemsData.forEach((item) => {
      if (item.category) {
        if (!categoryMap[item.category]) {
          categoryMap[item.category] = [];
        }
        categoryMap[item.category].push(item.id);
      }
    });
    setCategories(categoryMap);
  }, []);

  const formik = useFormik({
    initialValues: {
      taxValueText: "",
      taxValueNumber: "",
      checked1: false,
      checked2: false,
    },
    onSubmit: (values) => {
      console.log({
        applicable_items: selectedItems,
        applicable_to: values.checked1 ? "all" : "some",
        name: values.taxValueText,
        rate: Number(values.taxValueNumber) / 100,
      });
    },
  });

  const handleCategoryCheckboxChange = (category: string) => {
    const categoryItems = categories[category];
    const isAllSelected = categoryItems.every((id: any) =>
      selectedItems.includes(id)
    );

    setSelectedItems((prevSelectedItems) => {
      if (isAllSelected) {
        return prevSelectedItems.filter((id) => !categoryItems.includes(id));
      } else {
        return [...prevSelectedItems, ...categoryItems];
      }
    });
  };

  const handleItemCheckboxChange = (itemId: number) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(itemId)
        ? prevSelectedItems.filter((id) => id !== itemId)
        : [...prevSelectedItems, itemId]
    );
  };

  const handleSelectAllNoCategory = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      const noCategoryItems = itemsData
        .filter((item) => !item.category)
        .map((item) => item.id);
      setSelectedItems((prevSelectedItems) => [
        ...prevSelectedItems,
        ...noCategoryItems,
      ]);
    } else {
      const noCategoryItems = itemsData
        .filter((item) => !item.category)
        .map((item) => item.id);
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.filter((id) => !noCategoryItems.includes(id))
      );
    }
    setNoCategoryChecked(event.target.checked);
  };

  const handleSelectAllItems = () => {
    const allItemIds = itemsData.map((item) => item.id);
    const isAllSelected = formik.values.checked1;

    if (isAllSelected) {
      setSelectedItems([]);
      setNoCategoryChecked(false);
    } else {
      setSelectedItems(allItemIds);
      setNoCategoryChecked(true);
    }
    formik.setFieldValue("checked1", !isAllSelected);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 600,
        margin: "auto",
        marginTop: 4,
        padding: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 2,
        }}
      >
        <Typography variant="h6">Add Tax</Typography>
        <IconButton>
          <CloseIcon />
        </IconButton>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
          <TextField
            label="Tax Value"
            value={formik.values.taxValueText}
            onChange={(e) => {
              formik.setFieldValue("taxValueText", e.target.value);
              formik.setFieldValue(
                "taxValueNumber",
                textToNumber(e.target.value)
              );
            }}
            variant="outlined"
            type="text"
            sx={{ flex: 7 }}
          />
          <TextField
            label="Percentage"
            value={formik.values.taxValueNumber}
            onChange={(e) => {
              formik.setFieldValue("taxValueNumber", e.target.value);
              formik.setFieldValue(
                "taxValueText",
                numberToText(Number(e.target.value))
              );
            }}
            variant="outlined"
            type="number"
            sx={{ flex: 3 }}
            InputProps={{
              inputProps: {
                min: 0,
              },
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.checked1}
                onChange={handleSelectAllItems}
                inputProps={{ "aria-label": "Checkbox for all items" }}
                icon={CustomIcon}
                checkedIcon={CustomCheckedIcon}
              />
            }
            label="Apply to all items in collection"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.checked2}
                onChange={(e) =>
                  formik.setFieldValue("checked2", e.target.checked)
                }
                inputProps={{ "aria-label": "Checkbox 2" }}
                icon={CustomIcon}
                checkedIcon={CustomCheckedIcon}
              />
            }
            label="Apply to specific items"
          />
        </Box>

        <Divider />

        <Box
          sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}
        >
          <TextField
            variant="outlined"
            placeholder="Search item"
            size="small"
            sx={{ width: "50%" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ marginTop: 2 }}>
          {Object.keys(categories).map((category) => (
            <Box key={category}>
              <Box
                sx={{
                  backgroundColor: "#e0e0e0",
                  paddingX: 1,
                  borderRadius: 1,
                  marginBottom: 2,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={categories[category].every((itemId: any) =>
                        selectedItems.includes(itemId)
                      )}
                      onChange={() => handleCategoryCheckboxChange(category)}
                      inputProps={{ "aria-label": `Checkbox for ${category}` }}
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: 28,
                          borderRadius: "50%",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="subtitle1">{category}</Typography>
                  }
                />
              </Box>

              <Box sx={{ pl: 2, display: "flex", flexDirection: "column" }}>
                {categories[category].map((itemId: any) => {
                  const item = itemsData.find((item) => item.id === itemId);
                  return (
                    <FormControlLabel
                      key={itemId}
                      control={
                        <Checkbox
                          checked={selectedItems.includes(itemId)}
                          onChange={() => handleItemCheckboxChange(itemId)}
                          inputProps={{
                            "aria-label": `Checkbox for ${item?.name}`,
                          }}
                        />
                      }
                      label={item?.name}
                    />
                  );
                })}
              </Box>
            </Box>
          ))}

          <Box>
            <Box
              sx={{
                backgroundColor: "#e0e0e0",
                borderRadius: 1,
                marginBottom: 2,
              }}
            >
              <Checkbox
                checked={noCategoryChecked}
                onChange={handleSelectAllNoCategory}
                inputProps={{ "aria-label": "Checkbox for No Category" }}
                sx={{
                  "& .MuiSvgIcon-root": {
                    fontSize: 28,
                    borderRadius: "50%",
                  },
                }}
              />
            </Box>

            <Box sx={{ pl: 2, display: "flex", flexDirection: "column" }}>
              {itemsData
                .filter((item) => !item.category)
                .map((item) => (
                  <FormControlLabel
                    key={item.id}
                    control={
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleItemCheckboxChange(item.id)}
                        inputProps={{
                          "aria-label": `Checkbox for ${item.name}`,
                        }}
                      />
                    }
                    label={item.name}
                  />
                ))}
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
          <Button
            variant="contained"
            type="submit"
            sx={{
              backgroundColor: "#eb6e34",
              "&:hover": {
                backgroundColor: "#FF7043",
              },
            }}
          >
            {selectedItems.length === 1
              ? `Apply tax to 1 item`
              : selectedItems.length > 1
              ? `Apply tax to ${selectedItems.length} items`
              : "Apply"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default TaxForm;
