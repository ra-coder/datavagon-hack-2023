# import openpyxl
#
# wb = openpyxl.load_workbook(filename='../../data/disl_hackaton.xlsx')
# sheet_ranges = wb['range names']
# print(sheet_ranges['D18'].value)

import pandas as pd
xl = pd.ExcelFile('../../../data/disl_hackaton.xlsx')

for s_name in xl.sheet_names:
    data_xls = pd.read_excel('../../../data/disl_hackaton.xlsx', s_name, index_col=None)
    data_xls.to_csv(f'../../../data/parsed/disl_hackaton_{s_name}.csv', encoding='utf-8')



# data_xls = pd.read_excel('../../../data/STATION_COORDS_HACKATON.xlsx', index_col=None)
# data_xls.to_csv('../../../data/parsed/STATION_COORDS_HACKATON.csv', encoding='utf-8')

# TRAIN_INDEX <-> формирования - поезд - назначение
# предикт как поедет вагон