import itertools

import networkx as nx
import pandas as pd
from pathlib import Path


def read_graph_from_excel(file_path):
    df = pd.read_excel(file_path)
    G = nx.Graph()
    for index, row in df.iterrows():
        G.add_edge(int(row['START_CODE']), int(row['END_CODE']), weight=row['LEN'])
    return G


def find_shortest_path_including_nodes(graph, start_node, end_node, mandatory_nodes=None):
    if not mandatory_nodes:
        # Если нет обязательных узлов, просто найдем кратчайший путь между начальной и конечной точками
        path = nx.shortest_path(graph, source=start_node, target=end_node, weight='weight')
        length = nx.shortest_path_length(graph, source=start_node, target=end_node, weight='weight')
        return path, length

    shortest_path = None
    shortest_length = float('inf')

    for nodes_order in itertools.permutations(mandatory_nodes):
        current_path = [start_node]
        current_length = 0

        for i in range(len(nodes_order)):
            path = nx.shortest_path(graph, source=current_path[-1], target=nodes_order[i], weight='weight')
            length = nx.shortest_path_length(graph, source=current_path[-1], target=nodes_order[i], weight='weight')

            current_path += path[1:]
            current_length += length

            if i == len(nodes_order) - 1:
                final_path = nx.shortest_path(graph, source=nodes_order[i], target=end_node, weight='weight')
                final_length = nx.shortest_path_length(graph, source=nodes_order[i], target=end_node, weight='weight')
                current_path += final_path[1:]
                current_length += final_length

        if current_length < shortest_length:
            shortest_length = current_length
            shortest_path = current_path

    return shortest_path, shortest_length


path_root = Path(__file__).parents[0]


file_path = 'pg.xlsx'
print(f"{str(path_root)}/{file_path}")
graph = read_graph_from_excel(f"{str(path_root)}/{file_path}")

# start_node = 20772
# end_node = 13259
# mandatory_nodes = []  # [102, 61]
#
# path, length = find_shortest_path_including_nodes(graph, start_node, end_node, mandatory_nodes)
# print(f"Путь: {path}")
# print(f"Длина: {length}")
